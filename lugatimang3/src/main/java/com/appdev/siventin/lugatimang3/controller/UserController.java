package com.appdev.siventin.lugatimang3.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.UserEntity;
import com.appdev.siventin.lugatimang3.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    UserService uservice;

    @PostMapping("/register")
    public UserEntity register(@RequestBody UserEntity user) {
        return uservice.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity loginDetails) {
        UserEntity user = uservice.login(loginDetails.getUsername(), loginDetails.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
