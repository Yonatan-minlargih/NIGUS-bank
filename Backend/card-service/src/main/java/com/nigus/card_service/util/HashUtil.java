package com.nigus.card_service.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashUtil {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String hash(String value) {
        return encoder.encode(value);
    }

    public static boolean matches(String raw, String hashed) {
        return encoder.matches(raw, hashed);
    }
}
