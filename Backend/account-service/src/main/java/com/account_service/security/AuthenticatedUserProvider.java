package com.account_service.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserProvider {

    public Long getUserId(){

        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        if(principal == null){
            throw new RuntimeException("Unauthenticated request");
        }

        return (Long) principal;
    }
}
