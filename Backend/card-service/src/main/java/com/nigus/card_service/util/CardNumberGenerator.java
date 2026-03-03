package com.nigus.card_service.util;

import java.security.SecureRandom;

public class CardNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generate() {
        StringBuilder number = new StringBuilder("4");

        for (int i = 0; i < 14; i++) {
            number.append(random.nextInt(10));
        }

        int checkDigit = calculateLuhnCheckDigit(number.toString());
        number.append(checkDigit);

        return number.toString();
    }

    private static int calculateLuhnCheckDigit(String partialNumber) {
        int sum = 0;
        boolean shouldDouble = true;

        for (int i = partialNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(partialNumber.charAt(i));

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit = digit - 9;
                }
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        int remainder = sum % 10;
        return (remainder == 0) ? 0 : (10 - remainder);
    }

    public static void main(String[] args) {
        String cardNumber = generate();
        System.out.println("Generated card number: " + cardNumber);
        System.out.println("Length: " + cardNumber.length());
    }
}