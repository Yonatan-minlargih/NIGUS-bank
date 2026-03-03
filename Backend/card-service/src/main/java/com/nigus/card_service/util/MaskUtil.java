package com.nigus.card_service.util;

public class MaskUtil {

    public static String maskCardNumber(String cardNumber) {
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
}
