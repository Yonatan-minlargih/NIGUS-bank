package com.nigusbank.transaction.controller;

import com.nigusbank.transaction.dto.*;
import com.nigusbank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // adjust for your frontend
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Deposit money into an account
     * POST /transactions/deposit
     */
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @Valid @RequestBody DepositRequest request) {

        TransactionResponse response = transactionService.deposit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Withdraw money from an account
     * POST /transactions/withdraw
     */
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @Valid @RequestBody WithdrawRequest request) {

        TransactionResponse response = transactionService.withdraw(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Transfer money between accounts
     * POST /transactions/transfer
     */
    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(
            @Valid @RequestBody TransferRequest request) {

        transactionService.transfer(request);
        // 200 OK with no content body is standard for successful transfer
        // You can also return 202 Accepted or a response with trace ID if needed
        return ResponseEntity.ok().build();
    }

    /**
     * Get transaction history for a specific account
     * GET /transactions/history?accountId=123
     *
     * Returns enriched response including current balance
     */
    @GetMapping("/history")
    public ResponseEntity<TransactionHistoryResponse> getTransactionHistory(
            @RequestParam(value = "accountId", required = false) Long accountId) {

        TransactionHistoryResponse history = transactionService.getHistory(accountId);
        return ResponseEntity.ok(history);
    }


}