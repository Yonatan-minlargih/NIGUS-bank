package com.account_service.dto;

public record UserProfileDto(
        Long id,
        String email,
        String fullName,
        String role
) {}