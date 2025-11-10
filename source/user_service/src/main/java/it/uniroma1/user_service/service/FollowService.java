package it.uniroma1.user_service.service;

import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FollowService {

    private final UserRepository userRepository;

    public FollowService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
    }

    public void unfollowArtist(Long userId, Long artistId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity artist = userRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        user.getFollowedArtists().remove(artist);
        userRepository.save(user);
    }

    public Set<UserEntity> getFollowers(Long artistId) {
    List<UserEntity> allUsers = userRepository.findAll();
    return allUsers.stream()
            .filter(user -> user.getFollowedArtists().stream()
                    .anyMatch(artist -> artist.getId().equals(artistId)))
            .collect(Collectors.toSet());
}
}
