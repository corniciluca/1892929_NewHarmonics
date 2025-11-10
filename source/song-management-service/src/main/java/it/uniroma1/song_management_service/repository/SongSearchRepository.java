package it.uniroma1.song_management_service.repository;

import it.uniroma1.song_management_service.model.SongDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongSearchRepository extends ElasticsearchRepository<SongDocument, String> {
    
    // Search by title (case-insensitive, partial match)
    List<SongDocument> findByTitleContainingIgnoreCase(String title);
    
    // Search by artist
    List<SongDocument> findByArtistContainingIgnoreCase(String artist);
    
    // Search by genre
    List<SongDocument> findByGenre(String genre);
    
    // Search across title, artist, and album
    List<SongDocument> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCaseOrAlbumContainingIgnoreCase(
        String title, String artist, String album
    );
    
    // Find trending songs (by play count)
    List<SongDocument> findTop10ByOrderByPlayCountDesc();
    
    // Find recent uploads
    List<SongDocument> findTop10ByOrderByUploadDateDesc();
}