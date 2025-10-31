package it.uniroma1.notification_service.service;

import it.uniroma1.notification_service.model.NotificationEntity;
import it.uniroma1.notification_service.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    private final WebClient webClient;
    private final String userServiceUrl = "http://user-service:8080/users";

    public NotificationService(NotificationRepository notificationRepository, WebClient.Builder webClientBuilder) {
        this.notificationRepository = notificationRepository;
        this.webClient = webClientBuilder.baseUrl(userServiceUrl).build();
    }

    public void createNotificationsForArtistFollowers(
            Long artistId, 
            String artistName, 
            String songTitle, 
            String songId) {
        
        // Get all followers of this artist
        Set<Long> followerIds = getFollowersOfArtist(artistId);
        
        if (followerIds.isEmpty()) {
            log.info("No followers found for artist {}", artistName);
            return;
        }

        // Create notification for each follower
        for (Long followerId : followerIds) {
            NotificationEntity notification = new NotificationEntity();
            notification.setUserId(followerId);
            notification.setType(NotificationEntity.NotificationType.SONG_UPLOADED);
            notification.setMessage(artistName + " posted a new song: " + songTitle);
            notification.setReferenceId(songId);
            notification.setReferenceType(NotificationEntity.ReferenceType.SONG);
            
            // Set metadata fields
            notification.setArtistId(artistId);
            notification.setArtistName(artistName);
            notification.setSongTitle(songTitle);
            
            notificationRepository.save(notification);
        }

        log.info("Created {} notifications for artist {}", followerIds.size(), artistName);
    }

    private Set<Long> getFollowersOfArtist(Long artistId) {
        try {
            // Call user service to get followers
            List<?> followers = webClient.get()
                    .uri("/{artistId}/followers", artistId)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (followers == null) {
                return Set.of();
            }

            return followers.stream()
                    .map(obj -> ((Number) ((Map<?, ?>) obj).get("id")).longValue())
                    .collect(Collectors.toSet());

        } catch (Exception e) {
            log.error("Failed to fetch followers for artist {}", artistId, e);
            return Set.of();
        }
    }

    public List<NotificationEntity> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<NotificationEntity> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(Long userId) {
        List<NotificationEntity> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}