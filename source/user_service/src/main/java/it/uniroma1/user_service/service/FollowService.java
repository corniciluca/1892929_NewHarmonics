package it.uniroma1.user_service.service;

import it.uniroma1.user_service.event.FollowEvent;
import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.repository.UserRepository;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class FollowService {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    public FollowService(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Set<UserEntity> getFollowedArtists(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowedArtists();
    }

    public void followArtist(Long userId, Long artistId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity artist = userRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        user.getFollowedArtists().add(artist);
        userRepository.save(user);

        // Send event to RabbitMQ
        FollowEvent event = new FollowEvent("FOLLOW_EVENT", userId, artistId);

        rabbitTemplate.convertAndSend(
                "user.follow.exchange",   // must match RabbitMQConstants.USER_FOLLOW_EXCHANGE
                "",                       // fanout exchange ignores routing key
                event
        );

        System.out.println("Follow event sent");
    }

    public void unfollowArtist(Long userId, Long artistId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity artist = userRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        user.getFollowedArtists().remove(artist);
        userRepository.save(user);

        // ✅ Publish unfollow event
        FollowEvent event = new FollowEvent("UNFOLLOW_EVENT", userId, artistId);

        rabbitTemplate.convertAndSend("user.follow.exchange", "", event);

        System.out.println("Unfollow event sent");
    }
}
