package it.uniroma1.user_service.service;

import java.util.List;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import it.uniroma1.user_service.model.UserEntity;

public interface UserService {

    List<UserEntity> findAllUsers();

    UserEntity findUserById(Long id);
    UserEntity findUserByUsername(String username);
    UserEntity createUserEntity(UserEntity user);
    UserEntity updateUserEntity(Long id, UserEntity userDetails);
    void deleteUserEntity(Long id);
}