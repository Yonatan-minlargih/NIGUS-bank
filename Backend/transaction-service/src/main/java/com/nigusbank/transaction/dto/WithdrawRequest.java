package com.nigusbank.transaction.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequest {

    @NotNull(message = "Account ID is required")
    @Positive(message = "Account ID must be positive")
    private Long accountId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Withdrawal amount must be positive")
    @Digits(integer = 15, fraction = 2, message = "Amount must have max 15 digits before decimal and 2 after")
    private BigDecimal amount;

    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;

    @Builder.Default
    @Size(max = 3, message = "Currency code must be 3 letters")
    @Pattern(regexp = "[A-Z]{3}", message = "Currency must be 3 uppercase letters (ISO 4217)")
    private String currency = "ETB";
}