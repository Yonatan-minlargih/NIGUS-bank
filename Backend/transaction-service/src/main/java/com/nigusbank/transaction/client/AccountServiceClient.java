package com.nigusbank.transaction.client;

import com.nigusbank.transaction.dto.AccountDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

@FeignClient(name = "account-service")
public interface AccountServiceClient {

    @PutMapping("/accounts/{accountId}/debit")
    void debit(@PathVariable("accountId") Long accountId,
               @RequestParam("amount") BigDecimal amount,
               @RequestParam("description") String description);

    @PutMapping("/accounts/{accountId}/credit")
    void credit(@PathVariable("accountId") Long accountId,
                @RequestParam("amount") BigDecimal amount,
                @RequestParam("description") String description);

    // New: Validate account and get details
    @GetMapping("/accounts/{accountId}")
    AccountDto getAccount(@PathVariable("accountId") Long accountId);

    // Optional: Get current balance (if separate endpoint exists)
    @GetMapping("/accounts/{accountId}/balance")
    BigDecimal getBalance(@PathVariable("accountId") Long accountId);
}