package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.service.SongService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/songs")
public class SongController {

    private final SongService songService;
    private static final Logger log = LoggerFactory.getLogger(SongController.class);

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

        // 1. Set the correct audio content type (e.g., MP3)
        //    (You might want to make this dynamic later if you support .ogg or .wav)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("audio/mpeg"));

        // 2. Tell the browser the total length so it can build the seek bar
        headers.setContentLength(data.length);

        // 3. Tell the browser that we accept seek requests (byte ranges)
        headers.set("Accept-Ranges", "bytes");

        // 4. Return the data with the new streaming-friendly headers
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/cover")
    public ResponseEntity<byte[]> downloadCoverImage(@PathVariable String id) throws IOException {
        Song song = songService.getSongById(id);

        if (song.getCoverImageUrl() == null || song.getCoverImageUrl().isBlank()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Use SongService to fetch the cover bytes (MinIO-backed)
        byte[] data = songService.downloadCoverImage(id);

        // Try to infer content type from the stored object name (which contains original filename)
        String filename = song.getCoverImageUrl();
        String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        if (filename != null) {
            String lower = filename.toLowerCase(Locale.ROOT);
            if (lower.endsWith(".png")) contentType = "image/png";
            else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (lower.endsWith(".gif")) contentType = "image/gif";
            else if (lower.endsWith(".webp")) contentType = "image/webp";
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

    /**
     * Endpoint to update a song's details, including optional files.
     * Uses POST /songs/{id}/update to handle multipart/form-data.
     */
    @PostMapping("/{id}/update")
    public ResponseEntity<?> updateSongDetails(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("album") String album,
            @RequestParam("genre") String genre,
            @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
            @RequestParam(value = "coverFile", required = false) MultipartFile coverFile,
            @RequestHeader("X-User-Id") String userId
    ) {
        // Check ownership
        Song existingSong = songService.getSongById(id);
        if (!String.valueOf(existingSong.getArtistId()).equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only update your own songs"));
        }

        try {
            Song updatedSong = songService.updateSongDetails(id, title, album, genre, audioFile, coverFile);
            return ResponseEntity.ok(updatedSong);
        } catch (Exception e) {
            log.error("Failed to update song details for {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update song: " + e.getMessage()));
        }
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