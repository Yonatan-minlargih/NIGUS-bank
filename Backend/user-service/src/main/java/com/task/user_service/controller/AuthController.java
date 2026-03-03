package com.task.user_service.controller;

import com.task.user_service.config.JwtProvider;
import com.task.user_service.model.User;
import com.task.user_service.repository.UserRepository;
import com.task.user_service.request.LoginRequest;
import com.task.user_service.request.VerifyOtpRequest;
import com.task.user_service.response.AuthResponse;
import com.task.user_service.service.CustomerUserServiceImplementation;
import com.task.user_service.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomerUserServiceImplementation customUserDetails;

    @Autowired
    private OtpService otpService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
        String email = user.getEmail();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String address = user.getAddress();
        Boolean isPremium = user.getIsPremium();
        String phoneNumber = user.getPhoneNumber();
        Boolean twoFactoreEnabled = user.getTwoFactorEnabled();
        LocalDateTime createdAt = user.getCreatedAt();
        LocalDateTime updatedAt = user.getUpdatedAt();


        if (userRepository.findByEmail(email) != null) {
            throw new Exception("Email is already used by another account");
        }

        User createUser = new User();
        createUser.setEmail(email);
        createUser.setFirstName(firstName);
        createUser.setLastName(lastName);
        createUser.setAddress(address);
        createUser.setIsPremium(isPremium);
        createUser.setPhoneNumber(phoneNumber);
        createUser.setTwoFactorEnabled(twoFactoreEnabled);
        createUser.setCreatedAt(createdAt);
        createUser.setUpdatedAt(updatedAt);
        createUser.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(createUser);

        // Create proper authentication with authorities (so roles work everywhere)
        UserDetails userDetails = customUserDetails.loadUserByUsername(email);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication, savedUser.getId());

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Register Success");
        authResponse.setStatus(true);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get userId to put inside the JWT
        User user = userRepository.findByEmail(username);
        AuthResponse authResponse = new AuthResponse();

        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            otpService.generateAndSendOtp(user);

            authResponse.setMessage("OTP sent to your phone/email. Please verify.");
            authResponse.setTwoFactorRequired(true);
            authResponse.setStatus(true);
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        } else {
            String token = JwtProvider.generateToken(authentication, user.getId());
            authResponse.setJwt(token);
            authResponse.setMessage("Login Success");
            authResponse.setStatus(true);
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if (userDetails == null || !passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request){
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new BadCredentialsException("User not found");
        }

        if (otpService.validateOtp(request.getEmail(), request.getOtp())) {
            // Re-create authentication for JWT
            UserDetails userDetails = customUserDetails.loadUserByUsername(request.getEmail());
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            String token = JwtProvider.generateToken(authentication, user.getId());

            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwt(token);
            authResponse.setMessage("Login successful");
            authResponse.setStatus(true);

            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        } else {
            throw new BadCredentialsException("Invalid or expired OTP");
        }
    }

}