package it.uniroma1.song_management_service.listener;

import it.uniroma1.song_management_service.event.FollowEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserFollowEventListener {

    private final ConcurrentHashMap<Long, Set<Long>> userFollowedArtists = new ConcurrentHashMap<>();

    @RabbitListener(queues = "#{T(it.uniroma1.song_management_service.config.RabbitMQConstants).USER_FOLLOW_QUEUE}")
    public void handleFollowEvent(FollowEvent event) {
        Long userId = event.getUserId();
        Long artistId = event.getArtistId();

        if ("FOLLOW_EVENT".equals(event.getType())) {
            userFollowedArtists.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
                    .add(artistId);
            System.out.printf("User %d followed artist %d%n", userId, artistId);
        } else if ("UNFOLLOW_EVENT".equals(event.getType())) {
            userFollowedArtists.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
                    .remove(artistId);
            System.out.printf("User %d unfollowed artist %d%n", userId, artistId);
        }
    }

    public Set<Long> getFollowedArtists(Long userId) {
        return userFollowedArtists.getOrDefault(userId, Collections.emptySet());
    }
}
