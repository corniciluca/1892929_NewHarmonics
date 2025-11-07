package it.uniroma1.user_service.service;

import it.uniroma1.user_service.config.RabbitMQConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.repository.UserRepository;
import it.uniroma1.user_service.exceptions.UserNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;
    private final PasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    public UserServiceImpl(UserRepository userRepository, RabbitTemplate rabbitTemplate, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.passwordEncoder = passwordEncoder;
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
    public UserEntity updateUserEntity(Long id, UserEntity userDetails, String currentPassword, String newPassword) {
        UserEntity user = findUserById(id);

        // Update standard fields if provided
        if (userDetails.getUsername() != null && !userDetails.getUsername().isBlank())
            user.setUsername(userDetails.getUsername());
        if (userDetails.getEmail() != null && !userDetails.getEmail().isBlank())
            user.setEmail(userDetails.getEmail());
        // Role usually shouldn't be updatable by the user themselves, but keeping your logic:
        if (userDetails.getRole() != null)
            user.setRole(userDetails.getRole());

        // Handle Password Change securely
        if (newPassword != null && !newPassword.isBlank()) {
            // 1. Check if current password is provided
            if (currentPassword == null || currentPassword.isBlank()) {
                throw new IllegalArgumentException("Current password is required to set a new password.");
            }
            // 2. Verify current password matches DB hash
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new IllegalArgumentException("Current password does not match.");
            }
            // 3. Hash and set new password
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }

    @Transactional
    @Override
    public void deleteUserEntity(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        // 1️⃣ Remove this user from others' followedArtists
        List<UserEntity> allUsers = userRepository.findAll();
        for (UserEntity u : allUsers) {
            if (u.getFollowedArtists().remove(user)) {
                userRepository.save(u); // persist removal
            }
        }

        // 2️⃣ Clear user's own followedArtists
        user.getFollowedArtists().clear();

        // 3️⃣ Delete the user
        userRepository.delete(user);

        // 4️⃣ Send RabbitMQ notification
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConstants.USER_EXCHANGE,
                    RabbitMQConstants.USER_DELETED_ROUTING_KEY,
                    user.getId()
            );
        } catch (Exception e) {
            // log and ignore; deletion already done
            log.error("Failed to send user-deleted event for user {}", id, e);
        }
    }

    @Override
    public UserEntity findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Username not found: " + username));
    }

    @Transactional
    private void removeFromOtherUsersFollowLists(Long userId) {
        UserEntity toRemove = new UserEntity();
        toRemove.setId(userId);

        List<UserEntity> users = userRepository.findAll();
        for (UserEntity u : users) {
            u.getFollowedArtists().remove(toRemove);
        }
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserEntity save(UserEntity user) {
        return userRepository.save(user);
    }

}