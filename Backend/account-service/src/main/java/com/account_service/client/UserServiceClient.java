package com.account_service.client;

import com.account_service.dto.UserProfileDto;  // we'll create this
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user-service",
url = "${user_service.url:http://localhost:5001}")  // discovery name or use url=... for local testing
public interface UserServiceClient {

    @GetMapping("/api/user/profile")
    UserProfileDto getCurrentUserProfile();

    // Optional future methods (add endpoints in user-service if needed)
    // @GetMapping("/api/internal/users/{id}")
    // UserProfileDto getUserById(@PathVariable("id") Long id);
}