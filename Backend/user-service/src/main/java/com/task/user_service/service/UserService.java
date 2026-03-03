package com.task.user_service.service;

import com.task.user_service.model.User;

import java.util.List;

public interface UserService {

    public User getUserProfile(String jwt);

    public List<User> getAllUsers();
}
