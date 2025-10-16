package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.listener.UserFollowEventListener;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class FeedService {

    private final UserFollowEventListener followEventListener;
    private final SongRepository songRepository;

    public FeedService(UserFollowEventListener followEventListener, SongRepository songRepository) {
        this.followEventListener = followEventListener;
        this.songRepository = songRepository;
    }

    public List<Song> getFeedForUser(Long userId) {
        Set<Long> followed = followEventListener.getFollowedArtists(userId);
        if (followed.isEmpty()) return List.of();

        // Convert to Strings because your Song.artist is stored as String
        List<String> artistIds = followed.stream()
                .map(String::valueOf)
                .toList();

        return songRepository.findByArtistIn(artistIds);
    }
}
