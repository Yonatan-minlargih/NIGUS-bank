package com.nigus.card_service.client;  // or your preferred package

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "account-service")  // name must match spring.application.name in account-service
public interface AccountClient {

    /**
     * Calls account-service to check if an account belongs to a specific user.
     * This is a GET request to: http://account-service/accounts/{accountId}/belongs-to/{userId}
     */
    @GetMapping("/accounts/{accountId}/belongs-to/{userId}")
    boolean doesAccountBelongToUser(
            @PathVariable("accountId") Long accountId,
            @PathVariable("userId") String userId
    );
}
