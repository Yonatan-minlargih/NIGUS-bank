package com.account_service.controller;

import com.account_service.model.Account;
import com.account_service.request.CreateAccountRequest;
import com.account_service.service.AccountServiceImplmentation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountServiceImplmentation accountService;

    @PostMapping
    public Account createAccount(@RequestBody CreateAccountRequest request){
        return accountService.createAccount(request);
    }

    @GetMapping
    public List<Account> getMyAccounts(){
        return accountService.getMyAccounts();
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Long id){
        return accountService.getAccount(id);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Account> getAccountByUser(@PathVariable Long userId){
        return accountService.getAccountByUserId(userId);
    }

    @GetMapping("/{id}/balance")
    public BigDecimal getAccountBalance(@PathVariable Long id){
        Account account = accountService.getAccount(id);
        return account.getBalance();
    }

    @GetMapping("/report/pdf")
    public ResponseEntity<byte[]> downloadComprehensiveReport() {
        byte[] pdfBytes = accountService.generateComprehensiveAccountReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("comprehensive-account-report-" + LocalDate.now() + ".pdf")
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
