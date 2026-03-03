package com.nigus.card_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChangePinRequest {

    @NotNull(message = "Card ID is required")
    @Positive(message = "Card ID must be positive")
    private Long cardId;

    @NotBlank(message = "Current PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "Current PIN must be exactly 4 digits")
    private String oldPin;           // ← added for verification

    @NotBlank(message = "New PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "New PIN must be exactly 4 digits")
    private String newPin;
}