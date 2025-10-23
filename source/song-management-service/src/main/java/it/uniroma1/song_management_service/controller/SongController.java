package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.service.SongService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }


    // Downloads song {id}
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadSong(@PathVariable String id) throws IOException {
        byte[] data = songService.downloadSong(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"song.mp3\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable String id) {
        return ResponseEntity.ok(songService.getSongById(id));
    }

    
    // ARTIST ONLY - Upload song

    // Uploads a song
    @PostMapping("/upload")
    public ResponseEntity<?> uploadSong(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("artist") String artist,
            @RequestParam("artistId") Long artistId,
            @RequestParam("album") String album,
            @RequestParam("genre") String genre,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role
            ) {
        if (!"ARTIST".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only artists can upload songs");
        }

        try {
            Song song = songService.uploadSong(file, title, artist, artistId, album, genre);
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload song: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSong(
            @PathVariable String id,
            @RequestBody Song updatedSong,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"ARTIST".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only artists can update songs");
        }

        Song existingSong = songService.getSongById(id);
        
        // Check if the artist owns this song
        if (!existingSong.getArtistId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own songs");
        }

        return ResponseEntity.ok(songService.updateSong(id,updatedSong));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSong(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"ARTIST".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only artists can delete songs");
        }

        Song song = songService.getSongById(id);
        
        if (!song.getArtistId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own songs");
        }

        songService.deleteSong(id);
        return ResponseEntity.ok("Song deleted successfully");
    }

    // Returns all the songs by {artistId}
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Song>> getSongsByArtist(@PathVariable String artistId) {
        List<Song> songsByArtist = songService.getAllSongs().stream()
                .filter(s -> String.valueOf(s.getArtistId()).equals(artistId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(songsByArtist);
    }
}
