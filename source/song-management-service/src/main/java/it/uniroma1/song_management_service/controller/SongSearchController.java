package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import it.uniroma1.song_management_service.service.SongSearchService;
import it.uniroma1.song_management_service.service.SongService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/songs/search")
public class SongSearchController {
    
    @Autowired
    private SongSearchService searchService;
    @Autowired
    private SongService songService;

    @PostMapping("/reindex")
    public ResponseEntity<String> reindexAllSongs() {
        List<Song> allSongs = songService.getAllSongs();
        List<SongDocument> docs = allSongs.stream()
            .map(song -> new SongDocument(
                song.getId(),
                song.getTitle(),
                song.getArtist(),
                // Assicurati che il tuo modello 'Song' abbia questo metodo
                song.getArtistId(), // <-- PASSA IL NUOVO ID QUI
                song.getAlbum(),
                song.getGenre(),
                song.getCoverImageUrl(),
                song.getPlayCount(),
                (song.getUploadDate() != null) 
                    ? song.getUploadDate().atZone(ZoneId.systemDefault()).toOffsetDateTime() 
                    : null,
                song.getDurationSeconds(),
                song.getLikedBy()
            ))
            .collect(Collectors.toList());
        searchService.indexSongs(docs);
        return ResponseEntity.ok("Re-indexed " + docs.size() + " songs.");
    }
    
    @GetMapping
    public ResponseEntity<List<SongDocument>> search(@RequestParam String q) {
        List<SongDocument> results = searchService.searchSongs(q);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/title")
    public ResponseEntity<List<SongDocument>> searchByTitle(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchByTitle(q));
    }

    
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<SongDocument>> searchByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(searchService.searchByGenre(genre));
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<SongDocument>> getTrending() {
        return ResponseEntity.ok(searchService.getTrendingSongs());
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<SongDocument>> getRecent() {
        return ResponseEntity.ok(searchService.getRecentUploads());
    }
}