package com.nigus.card_service.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class CardResponse {

    private Long id;
    private Long accountId;
    private String maskedCardNumber;
    private String cardHolderName;
    private String status;
    private String category;
    private LocalDate expirationDate;
    private BigDecimal spendingLimit;
}