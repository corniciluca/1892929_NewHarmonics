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
    
    public void indexSong(SongDocument song) {
        searchRepository.save(song);
    }
    
    public List<SongDocument> searchSongs(String query) {
        return searchRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCaseOrAlbumContainingIgnoreCase(
            query, query, query
        );
    }
    
    public List<SongDocument> searchByTitle(String title) {
        return searchRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<SongDocument> searchByArtist(String artist) {
        return searchRepository.findByArtistContainingIgnoreCase(artist);
    }
    
    public List<SongDocument> searchByGenre(String genre) {
        return searchRepository.findByGenre(genre);
    }
    
    public List<SongDocument> getTrendingSongs() {
        return searchRepository.findTop10ByOrderByPlayCountDesc();
    }
    
    public List<SongDocument> getRecentUploads() {
        return searchRepository.findTop10ByOrderByUploadDateDesc();
    }
    
    public void incrementPlayCount(String songId) {
        searchRepository.findById(songId).ifPresent(song -> {
            song.setPlayCount(song.getPlayCount() + 1);
            searchRepository.save(song);
        });
    }
    
    public void deleteSong(String songId) {
        searchRepository.deleteById(songId);
    }

    public void indexSongs(List<SongDocument> docs) {
        for (SongDocument doc : docs) {
            searchRepository.save(doc);
        }
    }
}