package com.nigusbank.transaction.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountDto {
    private Long id;
    private Long userId;           // owner of the account
    private String accountNumber;
    private BigDecimal balance;
    private String status;
    // ... other fields if needed
}