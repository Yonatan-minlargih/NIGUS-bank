package com.nigusbank.transaction.implementation;

import com.nigusbank.transaction.client.AccountServiceClient;
import com.nigusbank.transaction.dto.*;
import com.nigusbank.transaction.entity.Transaction;
import com.nigusbank.transaction.exception.TransactionException;
import com.nigusbank.transaction.repository.TransactionRepository;
import com.nigusbank.transaction.service.TransactionService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;
    private final AccountServiceClient accountClient;

    // Temporarily disabled until JWT / SecurityContext is properly configured
    private void validateAccountOwnership(Long accountId) {
        // log.debug("Ownership check skipped for accountId: {}", accountId);
        // When ready: uncomment getCurrentUserId() and real validation
    }

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        validateAccountOwnership(request.getAccountId());

        try {
            accountClient.credit(
                    request.getAccountId(),
                    request.getAmount(),
                    "Deposit" + (request.getDescription() != null ? " - " + request.getDescription() : "")
            );

            Transaction tx = Transaction.builder()
                    .accountId(request.getAccountId())
                    .amount(request.getAmount())
                    .type(Transaction.TransactionType.DEPOSIT)
                    .currency(request.getCurrency() != null ? request.getCurrency() : "ETB")
                    .description(request.getDescription())
                    .build();

            transactionRepository.save(tx);
            return TransactionResponse.fromEntity(tx);

        } catch (FeignException e) {
            log.error("Credit failed during deposit", e);
            throw new TransactionException("Failed to credit account: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error during deposit", e);
            throw new TransactionException("Deposit operation failed", e);
        }
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        validateAccountOwnership(request.getAccountId());

        try {
            accountClient.debit(
                    request.getAccountId(),
                    request.getAmount(),
                    "Withdrawal" + (request.getDescription() != null ? " - " + request.getDescription() : "")
            );

            Transaction tx = Transaction.builder()
                    .accountId(request.getAccountId())
                    .amount(request.getAmount().negate())
                    .type(Transaction.TransactionType.WITHDRAWAL)
                    .currency(request.getCurrency() != null ? request.getCurrency() : "ETB")
                    .description(request.getDescription())
                    .build();

            transactionRepository.save(tx);
            return TransactionResponse.fromEntity(tx);

        } catch (FeignException e) {
            log.error("Debit failed during withdrawal", e);
            throw new TransactionException("Failed to debit account: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error during withdrawal", e);
            throw new TransactionException("Withdrawal operation failed", e);
        }
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        validateAccountOwnership(request.getFromAccountId());

        Long from = request.getFromAccountId();
        Long to = request.getToAccountId();
        String desc = request.getDescription() != null ? request.getDescription() : "Transfer";

        try {
            // 1. Debit source account
            accountClient.debit(from, request.getAmount(), "Transfer to " + to + " - " + desc);

            // 2. Credit destination account – with compensation on failure
            try {
                accountClient.credit(to, request.getAmount(), "Transfer from " + from + " - " + desc);
            } catch (FeignException creditEx) {
                log.error("Credit to destination failed after debit succeeded", creditEx);
                try {
                    // Compensation: credit back the source
                    accountClient.credit(from, request.getAmount(), "Compensation - failed transfer to " + to);
                    log.info("Compensation credit succeeded - source account restored");
                } catch (Exception compEx) {
                    log.error("Compensation credit also failed - manual reconciliation required", compEx);
                    throw new TransactionException(
                            "Critical: Transfer partially completed but compensation failed. Manual fix needed.", compEx);
                }
                throw new TransactionException("Transfer failed - destination credit unsuccessful", creditEx);
            }

            // 3. Only after both remote calls succeed → save local records
            Transaction out = Transaction.builder()
                    .accountId(from)
                    .amount(request.getAmount().negate())
                    .type(Transaction.TransactionType.TRANSFER_OUT)
                    .currency(request.getCurrency() != null ? request.getCurrency() : "ETB")
                    .description(desc + " → " + to)
                    .build();
            transactionRepository.save(out);

            Transaction in = Transaction.builder()
                    .accountId(to)
                    .amount(request.getAmount())
                    .type(Transaction.TransactionType.TRANSFER_IN)
                    .currency(request.getCurrency() != null ? request.getCurrency() : "ETB")
                    .description(desc + " ← " + from)
                    .build();
            transactionRepository.save(in);

        } catch (FeignException e) {
            throw new TransactionException("Transfer failed due to communication error with account service", e);
        }
    }

    @Override
    public TransactionHistoryResponse getHistory(Long accountId) {
        // validateAccountOwnership(accountId); // skipped for now

        List<Transaction> transactions;
        if (accountId != null) {
            transactions = transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);
        } else {
            transactions = transactionRepository.findAllByOrderByCreatedAtDesc();
        }

        List<TransactionResponse> transactionResponses = transactions.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());

        // TODO: Fetch current balance from account service when accountId is provided
        BigDecimal currentBalance = accountId != null ? BigDecimal.ZERO : null;

        return TransactionHistoryResponse.builder()
                .accountId(accountId)
                .currentBalance(currentBalance)
                .transactions(transactionResponses)
                .totalCount(transactionResponses.size())
                .build();
    }
}