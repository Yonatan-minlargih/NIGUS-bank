package com.nigus.card_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CardCreateRequest {

    @NotNull(message = "Account ID is required")
    @Positive(message = "Account ID must be positive")
    private Long accountId;

    @NotBlank(message = "Card holder name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
    private String cardHolderName;

    @NotBlank(message = "Category is required")
    @Pattern(
            regexp = "VISA|MASTERCARD|AMEX|PREPAID|VIRTUAL",
            message = "Category must be one of: VISA, MASTERCARD, AMEX, PREPAID, VIRTUAL"
    )
    private String category;

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 digits")
    private String pin;

    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "^\\d{3,4}$", message = "CVV must be 3 or 4 digits")
    private String cvv;

    @NotNull(message = "Spending limit is required")
    @DecimalMin(
            value = "0.01",
            inclusive = false,  // ← rejects 0.00 and below
            message = "Spending limit must be greater than 0"
    )
    @Digits(integer = 10, fraction = 2, message = "Max 10 digits before decimal, 2 after")
    private BigDecimal spendingLimit;
}
