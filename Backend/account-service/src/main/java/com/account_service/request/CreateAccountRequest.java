package com.account_service.request;

import com.account_service.entity.AccountStatus;
import com.account_service.entity.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccountRequest {
    private String accountName;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    //private Double interestRate;
    private AccountStatus status;
    private LocalDateTime opendAt;
}
