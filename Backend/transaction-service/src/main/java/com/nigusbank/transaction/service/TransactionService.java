package com.nigusbank.transaction.service;

import com.nigusbank.transaction.dto.*;

import java.util.List;

public interface TransactionService {

    TransactionResponse deposit(DepositRequest request);

    TransactionResponse withdraw(WithdrawRequest request);

    void transfer(TransferRequest request);

    List<TransactionResponse> getHistory(Long accountId);
}