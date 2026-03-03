package com.nigusbank.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {


        private Long accountId;
        private BigDecimal currentBalance;      // from account-service
        private List<TransactionResponse> transactions;
        private int totalCount;
        // optional: LocalDateTime periodStart, periodEnd
    }
