package it.uniroma1.song_management_service.repository;

import it.uniroma1.song_management_service.model.Song;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SongRepository extends MongoRepository<Song, String> {
    List<Song> findByArtistIdIn(List<Long> artistIds);
    List<Song> findByArtistId(Long artistId);
}