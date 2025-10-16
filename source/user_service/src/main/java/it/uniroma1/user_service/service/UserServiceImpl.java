package it.uniroma1.user_service.service;

import org.springframework.stereotype.Service;
import java.util.List;
import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.repository.UserRepository;
import it.uniroma1.user_service.exceptions.UserNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    public UserEntity createUserEntity(UserEntity user) {
        return userRepository.save(user);
    }

    @Override
    public UserEntity updateUserEntity(Long id, UserEntity userDetails) {
        UserEntity user = findUserById(id);
        if (userDetails.getUsername() != null)
            user.setUsername(userDetails.getUsername());
        if (userDetails.getEmail() != null)
            user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null)
            user.setPassword(userDetails.getPassword());
        if (userDetails.getRole() != null)
            user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @Override
    public void deleteUserEntity(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserEntity findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Username not found: " + username));
    }
}