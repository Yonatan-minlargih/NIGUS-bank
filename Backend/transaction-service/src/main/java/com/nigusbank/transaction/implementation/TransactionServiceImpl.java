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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;
    private final AccountServiceClient accountClient;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        try {
            accountClient.credit(
                    request.getAccountId(),
                    request.getAmount(),
                    "Deposit" + (request.getDescription() != null ? " - " + request.getDescription() : "")
            );

            Transaction tx = new Transaction();
            tx.setAccountId(request.getAccountId());
            tx.setAmount(request.getAmount());
            tx.setType(Transaction.TransactionType.DEPOSIT);
            tx.setCurrency(request.getCurrency());
            tx.setDescription(request.getDescription());

            transactionRepository.save(tx);
            return TransactionResponse.fromEntity(tx);

        } catch (FeignException e) {
            throw new TransactionException("Failed to credit account: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        try {
            accountClient.debit(
                    request.getAccountId(),
                    request.getAmount(),
                    "Withdrawal" + (request.getDescription() != null ? " - " + request.getDescription() : "")
            );

            Transaction tx = new Transaction();
            tx.setAccountId(request.getAccountId());
            tx.setAmount(request.getAmount().negate());
            tx.setType(Transaction.TransactionType.WITHDRAWAL);
            tx.setCurrency(request.getCurrency());
            tx.setDescription(request.getDescription());

            transactionRepository.save(tx);
            return TransactionResponse.fromEntity(tx);

        } catch (FeignException e) {
            throw new TransactionException("Failed to debit account: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        Long from = request.getFromAccountId();
        Long to = request.getToAccountId();
        String desc = request.getDescription() != null ? request.getDescription() : "Transfer";

        try {
            // 1. Debit source account (remote)
            accountClient.debit(from, request.getAmount(), "Transfer to " + to + " - " + desc);

            // 2. Credit destination account (remote)
            try {
                accountClient.credit(to, request.getAmount(), "Transfer from " + from + " - " + desc);
            } catch (FeignException creditEx) {
                log.error("Credit to destination failed after debit. Attempting compensation (credit back) - from={}, to={}, amount={}", from, to, request.getAmount());
                // Attempt to undo the debit by crediting back the source
                try {
                    accountClient.credit(from, request.getAmount(), "Compensation for failed transfer to " + to + " - " + desc);
                } catch (Exception compEx) {
                    // Compensation failed — this is a serious inconsistency, bubble up
                    throw new TransactionException("Transfer failed and compensation also failed. Manual intervention required. creditEx=" + creditEx.getMessage() + ", compEx=" + compEx.getMessage(), compEx);
                }
                throw new TransactionException("Failed to credit destination account: " + creditEx.getMessage(), creditEx);
            }

            // 3. Persist transaction records only after both remote operations succeeded
            Transaction out = new Transaction();
            out.setAccountId(from);
            out.setAmount(request.getAmount().negate());
            out.setType(Transaction.TransactionType.TRANSFER_OUT);
            out.setCurrency(request.getCurrency());
            out.setDescription(desc + " -> " + to);
            transactionRepository.save(out);

            Transaction in = new Transaction();
            in.setAccountId(to);
            in.setAmount(request.getAmount());
            in.setType(Transaction.TransactionType.TRANSFER_IN);
            in.setCurrency(request.getCurrency());
            in.setDescription(desc + " <- " + from);
            transactionRepository.save(in);

        } catch (FeignException e) {
            // network/remote failure
            throw new TransactionException("Transfer failed due to remote call failure: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TransactionResponse> getHistory(Long accountId) {
        return transactionRepository.findByAccountId(accountId)
                .stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
