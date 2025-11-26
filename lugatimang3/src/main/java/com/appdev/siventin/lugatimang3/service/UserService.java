package com.appdev.siventin.lugatimang3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.UserEntity;
import com.appdev.siventin.lugatimang3.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository urepo;

    public UserEntity register(UserEntity user) {
        return urepo.save(user);
    }

    public UserEntity login(String username, String password) {
        UserEntity user = urepo.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null; // Or throw exception
    }
}
