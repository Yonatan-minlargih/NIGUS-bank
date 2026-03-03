package com.task.user_service.service;

import com.task.user_service.config.JwtProvider;
import com.task.user_service.model.User;
import com.task.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplmentation implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public User getUserProfile(String jwt) {
       String email = JwtProvider.getEmailFromJwtToken(jwt);
       return userRepository.findByEmail(email);

    }

    @Override
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
