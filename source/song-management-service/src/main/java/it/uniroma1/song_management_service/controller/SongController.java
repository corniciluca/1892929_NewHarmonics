package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.service.SongService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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

    @PostMapping("/upload")
    public Song uploadSong(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("artist") String artist,
            @RequestParam("artistId") Long artistId,
            @RequestParam("album") String album,
            @RequestParam("genre") String genre
    ) throws IOException {
        return songService.uploadSong(file, title, artist, artistId, album, genre);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadSong(@PathVariable String id) throws IOException {
        byte[] data = songService.downloadSong(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"song.mp3\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
    }
}
