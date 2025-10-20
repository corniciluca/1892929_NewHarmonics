package it.uniroma1.user_service.service;

import java.util.List;

import it.uniroma1.user_service.model.UserEntity;

public interface UserService {

    List<UserEntity> findAllUsers();

    UserEntity findUserById(Long id);
    boolean existsByUsername(String username);
    UserEntity findUserByUsername(String username);
    UserEntity createUserEntity(UserEntity user);
    UserEntity updateUserEntity(Long id, UserEntity userDetails);
    void deleteUserEntity(Long id);
    UserEntity save(UserEntity user);
}