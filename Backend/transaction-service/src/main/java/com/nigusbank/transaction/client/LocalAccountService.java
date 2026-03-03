package com.nigusbank.transaction.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Local stub for AccountServiceClient used for local testing without the Account Service.
 * It is enabled when property `app.account.local-stub=true`.
 * Behavior: credit/debit are no-ops but logged. In production, disable this stub and
 * rely on the real Feign client + Eureka discovery.
 */
@Service
@ConditionalOnProperty(prefix = "app.account", name = "local-stub", havingValue = "true", matchIfMissing = true)
@Slf4j
public class LocalAccountService implements AccountServiceClient {

    @Override
    public void debit(Long accountId, BigDecimal amount, String description) {
        log.info("[local-stub] debit called: accountId={}, amount={}, desc={}", accountId, amount, description);
        // Simulate success; don't persist any account state here.
    }

    @Override
    public void credit(Long accountId, BigDecimal amount, String description) {
        log.info("[local-stub] credit called: accountId={}, amount={}, desc={}", accountId, amount, description);
        // Simulate success
    }
}

