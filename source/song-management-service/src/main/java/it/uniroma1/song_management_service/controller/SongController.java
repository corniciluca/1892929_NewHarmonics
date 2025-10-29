package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.service.SongService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/{id}/cover")
    public ResponseEntity<byte[]> downloadCoverImage(@PathVariable String id) throws IOException {
        Song song = songService.getSongById(id);
        
        if (song.getCoverImageUrl() == null || song.getCoverImageUrl().isBlank()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Path imagePath = Paths.get(song.getCoverImageUrl());
        
        if (!Files.exists(imagePath)) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        byte[] data = Files.readAllBytes(imagePath);
        
        // Automatically determine content type (e.g., image/jpeg, image/png)
        String contentType = Files.probeContentType(imagePath);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
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
            @RequestParam("coverImage") MultipartFile coverImage,
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
            Song song = songService.uploadSong(file, coverImage, title, artist, artistId, album, genre);
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload song: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSong(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody Song updatedSong) {

        Song existingSong = songService.getSongById(id);
        System.out.println("DEBUG: User ID: " + userId + ", Song Artist ID: " + existingSong.getArtistId());

        // Check ownership
        String existingArtistId = String.valueOf(existingSong.getArtistId());
        String currentUserId = String.valueOf(userId);
        System.out.println("DEBUG: User ID: " + currentUserId + ", Song Artist ID: " + existingArtistId);
        boolean isOwner = currentUserId.equals(existingArtistId);
        System.out.println("DEBUG: Ownership Check Result: " + isOwner);

        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own songs");
        }

        // Keep the original artist ID (as the request body might not contain it)
        updatedSong.setArtistId(existingSong.getArtistId());

        return ResponseEntity.ok(songService.updateSong(id,updatedSong));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSong(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {
        Song song = songService.getSongById(id);

        // Check for song existence
        if (song == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Song not found");
        }

        // Defensive conversion and comparison (Fix for deleteSong)
        String existingArtistId = String.valueOf(song.getArtistId());
        String currentUserId = String.valueOf(userId);

        System.out.println("DEBUG (deleteSong): User ID: " + currentUserId + ", Song Artist ID: " + existingArtistId);
        boolean isOwner = currentUserId.equals(existingArtistId);
        System.out.println("DEBUG (deleteSong): Ownership Check Result: " + isOwner);

        // Check ownership
        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own songs");
        }

        songService.deleteSong(id);
        return ResponseEntity.ok(Map.of("message", "Song deleted successfully"));
    }

    // Returns all the songs by {artistId}
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Song>> getSongsByArtist(@PathVariable String artistId) {
        List<Song> songsByArtist = songService.getAllSongs().stream()
                .filter(s -> String.valueOf(s.getArtistId()).equals(artistId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(songsByArtist);
    }

    /**
     * Endpoint to like a specific song.
     * Corresponds to POST /songs/{id}/like
     * The liking user is identified by the X-User-Id header.
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, String>> likeSong(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid User ID format"));
        }

        try {
            songService.likeSong(id, currentUserId);
            return ResponseEntity.ok(Map.of("message", "Song liked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint to unlike a specific song.
     * Corresponds to DELETE /songs/{id}/like
     * The unliking user is identified by the X-User-Id header.
     */
    @DeleteMapping("/{id}/like")
    public ResponseEntity<Map<String, String>> unlikeSong(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid User ID format"));
        }

        try {
            songService.unlikeSong(id, currentUserId);
            return ResponseEntity.ok(Map.of("message", "Song unliked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint to get all songs liked by the current user.
     * Corresponds to GET /songs/liked
     * The user is identified by the X-User-Id header.
     */
    @GetMapping("/liked")
    public ResponseEntity<?> getLikedSongs(
            @RequestHeader("X-User-Id") String userId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid User ID format"));
        }

        try {
            List<Song> likedSongs = songService.getLikedSongs(currentUserId);
            return ResponseEntity.ok(likedSongs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
