package com.nigusbank.transaction;

import com.nigusbank.transaction.dto.DepositRequest;
import com.nigusbank.transaction.entity.Transaction;
import com.nigusbank.transaction.repository.TransactionRepository;
import com.nigusbank.transaction.client.AccountServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TransactionIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private TransactionRepository transactionRepository;

    @MockBean
    private AccountServiceClient accountServiceClient;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
    }

    @Test
    void deposit_shouldCreateTransaction_andCallAccountService() {
        // Arrange
        long accountId = 1L;
        BigDecimal amount = new BigDecimal("100.00");
        DepositRequest req = DepositRequest.builder()
                .accountId(accountId)
                .amount(amount)
                .currency("ETB")
                .description("Integration test deposit")
                .build();

        // Mock Feign client to do nothing (successful remote call)
        doNothing().when(accountServiceClient).credit(eq(accountId), any(BigDecimal.class), any(String.class));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<DepositRequest> entity = new HttpEntity<>(req, headers);

        String url = "http://localhost:" + port + "/transactions/deposit";

        // Act
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        // Assert
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();

        List<Transaction> all = transactionRepository.findAll();
        assertThat(all).hasSize(1);
        Transaction tx = all.get(0);
        assertThat(tx.getAccountId()).isEqualTo(accountId);
        assertThat(tx.getAmount()).isEqualTo(amount);
        assertThat(tx.getType()).isEqualTo(Transaction.TransactionType.DEPOSIT);

        // verify that accountServiceClient.credit was called with expected args
        ArgumentCaptor<BigDecimal> amtCap = ArgumentCaptor.forClass(BigDecimal.class);
        ArgumentCaptor<String> descCap = ArgumentCaptor.forClass(String.class);
        verify(accountServiceClient).credit(eq(accountId), amtCap.capture(), descCap.capture());
        assertThat(amtCap.getValue()).isEqualTo(amount);
        assertThat(descCap.getValue()).contains("Integration test deposit");
    }
}
