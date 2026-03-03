package com.account_service.service;

import com.account_service.client.UserServiceClient;
import com.account_service.dto.UserProfileDto;
import com.account_service.entity.AccountStatus;
import com.account_service.entity.AccountType;
import com.account_service.model.Account;
import com.account_service.repository.AccountRepository;
import com.account_service.request.CreateAccountRequest;
import com.account_service.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AccountServiceImplmentation {

    private final AccountRepository accountRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final UserServiceClient userServiceClient;


    public Account createAccount(CreateAccountRequest request){

        Long userId = authenticatedUserProvider.getUserId();

        UserProfileDto user = userServiceClient.getCurrentUserProfile();

        Account account = Account.builder()
                .userId(userId)
                .accountName(request.getAccountName())
                .accountNumber(generateAccountNumber())
                .accountType(request.getAccountType())
                .balance(request.getBalance())
                .interestRate(getInterestRate(request.getAccountType()))
                .status(request.getStatus())
                .opendAt(LocalDateTime.now())
                .build();
        return accountRepository.save(account);
    }

    public List<Account> getMyAccounts(){
        Long userId = authenticatedUserProvider.getUserId();
        return accountRepository.findByUserId(userId);
    }

    public Account getAccount(Long id){

        Long userId = authenticatedUserProvider.getUserId();

        Account account = accountRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Accont not Found"));

        if(!account.getUserId().equals(userId)){
            throw new RuntimeException("Access denied: not your account");
        }

        return account;
    }

    public List<Account> getAccountByUserId(Long userId){
        return accountRepository.findByUserId(userId);
    }

    private String generateAccountNumber(){
       long timestamp = System.nanoTime();
       int randomPart = ThreadLocalRandom.current().nextInt(1000,10000);
       return String.format("AC%012d%04d", timestamp % 1000000000000L, randomPart);
    }

    private double getInterestRate(AccountType type){
        return switch(type){
            case SAVING -> 3.5;
            case CHECKING -> 0.5;
            case BUSINESS -> 1.0;
            case FIXED_DEPOSIT -> 7.5;

        };

    }

    public byte[] generateComprehensiveAccountReport() {
        List<Account> accounts = getMyAccounts();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Landscape for better table readability
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLUE);
            Paragraph title = new Paragraph("COMPREHENSIVE ACCOUNT REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Generated date
            Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Paragraph datePara = new Paragraph("Generated on: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")), dateFont);
            datePara.setAlignment(Element.ALIGN_CENTER);
            datePara.setSpacingAfter(20);
            document.add(datePara);

            // Table
            PdfPTable table = new PdfPTable(new float[]{2.5f, 1.4f, 1.8f, 1.3f, 1.4f, 2.2f});
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            // Headers
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);
            String[] headers = {"Account Number", "Type", "Balance", "Interest Rate", "Status", "Opened At"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new Color(0, 51, 102));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);
                table.addCell(cell);
            }

            // Data rows
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            BigDecimal totalBalance = BigDecimal.ZERO;
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            if (accounts.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("No accounts found.",
                        FontFactory.getFont(FontFactory.HELVETICA, 12, Color.RED)));
                emptyCell.setColspan(6);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                emptyCell.setPadding(20);
                table.addCell(emptyCell);
            } else {
                for (Account account : accounts) {
                    table.addCell(new Phrase(account.getAccountNumber(), dataFont));
                    table.addCell(new Phrase(account.getAccountType().toString(), dataFont));
                    table.addCell(new Phrase(account.getBalance().toPlainString(), dataFont));
                    table.addCell(new Phrase(account.getInterestRate() + "%", dataFont));
                    table.addCell(new Phrase(account.getStatus().toString(), dataFont));
                    table.addCell(new Phrase(account.getOpendAt().format(formatter), dataFont));

                    totalBalance = totalBalance.add(account.getBalance());
                }

                // Total row
                PdfPCell totalLabel = new PdfPCell(new Phrase("TOTAL BALANCE ACROSS ALL ACCOUNTS",
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
                totalLabel.setColspan(5);
                totalLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalLabel.setBackgroundColor(Color.LIGHT_GRAY);
                totalLabel.setPadding(8);
                table.addCell(totalLabel);

                PdfPCell totalValue = new PdfPCell(new Phrase(totalBalance.toPlainString() + " ETB",
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
                totalValue.setHorizontalAlignment(Element.ALIGN_CENTER);
                totalValue.setBackgroundColor(Color.LIGHT_GRAY);
                totalValue.setPadding(8);
                table.addCell(totalValue);
            }

            document.add(table);

            // Footer
            Paragraph footer = new Paragraph("\nThis is a system-generated report. For official use only.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate comprehensive PDF report", e);
        }
    }
}
