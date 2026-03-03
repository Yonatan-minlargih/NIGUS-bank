package com.nigusbank.transaction.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

// Production: resolve account-service via service discovery (Eureka)
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
}