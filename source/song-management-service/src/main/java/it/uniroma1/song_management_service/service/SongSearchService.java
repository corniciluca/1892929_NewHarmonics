package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SongSearchService {
    
    @Autowired
    private SongSearchRepository searchRepository;
    
    // Index a song when uploaded
    public void indexSong(SongDocument song) {
        searchRepository.save(song);
    }
    
    // Simple search across all fields
    public List<SongDocument> searchSongs(String query) {
        return searchRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCaseOrAlbumContainingIgnoreCase(
            query, query, query
        );
    }
    
    // Search by specific field
    public List<SongDocument> searchByTitle(String title) {
        return searchRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<SongDocument> searchByArtist(String artist) {
        return searchRepository.findByArtistContainingIgnoreCase(artist);
    }
    
    public List<SongDocument> searchByGenre(String genre) {
        return searchRepository.findByGenre(genre);
    }
    
    // Get trending songs
    public List<SongDocument> getTrendingSongs() {
        return searchRepository.findTop10ByOrderByPlayCountDesc();
    }
    
    // Get recent uploads
    public List<SongDocument> getRecentUploads() {
        return searchRepository.findTop10ByOrderByUploadDateDesc();
    }
    
    // Update play count
    public void incrementPlayCount(String songId) {
        searchRepository.findById(songId).ifPresent(song -> {
            song.setPlayCount(song.getPlayCount() + 1);
            searchRepository.save(song);
        });
    }
    
    // Delete from index
    public void deleteSong(String songId) {
        searchRepository.deleteById(songId);
    }

    public void indexSongs(List<SongDocument> docs) {
        for (SongDocument doc : docs) {
            searchRepository.save(doc);
        }
    }
}