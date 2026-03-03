package com.nigus.card_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SpendingLimitRequest {

    @NotNull(message = "Card ID is required")
    @Positive(message = "Card ID must be positive")
    private Long cardId;

    @NotNull(message = "Spending limit is required")
    @DecimalMin(
            value = "0.01",
            inclusive = false,
            message = "Spending limit must be greater than 0"
    )
    @Digits(integer = 10, fraction = 2, message = "Max 10 digits before decimal, 2 after")
    private BigDecimal spendingLimit;
}
