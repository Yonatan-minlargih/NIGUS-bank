package com.nigus.card_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;

    // ... existing fields ...

    @Column(nullable = false)
    private int failedPinAttempts = 0;  // default 0

    @Column(nullable = false)
    private String cardNumberHash;

    @Column(nullable = false)
    private String maskedCardNumber;

    private String cardHolderName;

    @Column(nullable = false)
    private String cvvHash;

    @Column(nullable = false)
    private String pinHash;

    @Enumerated(EnumType.STRING)
    private CardStatus status;

    private String category;

    private LocalDate expirationDate;

    private BigDecimal spendingLimit;

    private LocalDateTime createdAt;
}
