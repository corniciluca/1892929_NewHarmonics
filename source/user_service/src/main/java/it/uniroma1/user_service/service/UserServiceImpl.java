package it.uniroma1.user_service.service;

import it.uniroma1.user_service.config.RabbitMQConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.repository.UserRepository;
import it.uniroma1.user_service.exceptions.UserNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    public UserServiceImpl(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
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

}