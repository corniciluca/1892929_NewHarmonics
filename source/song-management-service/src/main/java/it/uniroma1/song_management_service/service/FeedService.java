package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final SongRepository songRepository;
    private final WebClient webClient;
    private static final Logger log = LoggerFactory.getLogger(FeedService.class);

    private final String userServiceUrl = "http://user-service:8080/users"; // gateway routes to user service

    public FeedService(SongRepository songRepository, WebClient webClient) {
        this.songRepository = songRepository;
        this.webClient = webClient;
    }

    public List<Song> getFeedForUser(Long userId) {
        Set<Long> followedArtistIds;

        try {
            followedArtistIds = ((List<?>) webClient.get()
                    .uri(userServiceUrl + "/{id}/followed", userId)
                    .header("X-User-Id", userId.toString())
                    .retrieve()
                    .bodyToMono(List.class)
                    .block())
                    .stream()
                    .map(obj -> ((Number)((Map<?, ?>)obj).get("id")).longValue())
                    .collect(Collectors.toSet());

        } catch (WebClientResponseException.NotFound e) {
            log.warn("User {} not found", userId);
            return List.of();
        } catch (Exception e) {
            log.error("Error fetching followed artists for user {}", userId, e);
            return List.of();
        }

        if (followedArtistIds.isEmpty()) {
            log.info("User {} follows no artists", userId);
            return List.of();
        }

        log.info("User {} follows {} artists", userId, followedArtistIds.size());

        return songRepository.findByArtistIdIn(List.copyOf(followedArtistIds));
    }
}
