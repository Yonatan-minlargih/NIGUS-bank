package com.task.user_service.service;

import com.task.user_service.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final ConcurrentHashMap<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    @Autowired(required = false)  // optional in case you remove mail later
    private JavaMailSender mailSender;

    private final SecureRandom random = new SecureRandom();

    public void generateAndSendOtp(User user) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        otpStore.put(user.getEmail(), new OtpRecord(otp, expiry, user.getId()));

        // Send to phone (console for now - replace with Twilio later)
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isBlank()) {
            System.out.println("🔐 OTP for " + user.getPhoneNumber() + " → " + otp);
            // TODO: Twilio.sendSms(user.getPhoneNumber(), "Your verification code is: " + otp);
        }

        // Send to email
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("Your Login OTP");
                message.setText("Hello " + user.getFirstName() + ",\n\nYour 2FA code is: " + otp +
                        "\n\nThis code expires in 5 minutes.");
                mailSender.send(message);
                System.out.println("📧 OTP sent to email: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send email OTP: " + e.getMessage());
            }
        }
    }

    public boolean validateOtp(String email, String otp) {
        OtpRecord record = otpStore.get(email);
        if (record == null) return false;

        if (LocalDateTime.now().isAfter(record.expiry)) {
            otpStore.remove(email);
            return false;
        }

        boolean valid = record.otp.equals(otp);
        if (valid) {
            otpStore.remove(email); // one-time use
        }
        return valid;
    }

    // Helper record
    private record OtpRecord(String otp, LocalDateTime expiry, Long userId) {}
}