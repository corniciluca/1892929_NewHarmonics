package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.repository.SongRepository;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final Path musicUploadDir;
    private final Path coverUploadDir;
    private final SongSearchRepository searchRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(SongService.class);

    public SongService(SongRepository songRepository, SongSearchRepository searchRepository, RabbitTemplate rabbitTemplate, @Value("${app.music.storage-dir:/app/music}") String uploadDirPath) throws IOException {
        this.songRepository = songRepository;
        this.searchRepository = searchRepository;
        this.rabbitTemplate = rabbitTemplate;
        
        // Base directory
        Path baseDir = Paths.get(uploadDirPath);
        
        // Directory for music files
        this.musicUploadDir = baseDir.resolve("audio");
        
        // Directory for cover images
        this.coverUploadDir = baseDir.resolve("covers");

        // Create directories if they don't exist
        if (!Files.exists(musicUploadDir)) {
            Files.createDirectories(musicUploadDir);
        }
        if (!Files.exists(coverUploadDir)) {
            Files.createDirectories(coverUploadDir);
        }
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Song uploadSong(MultipartFile audioFile, MultipartFile coverImageFile, String title, String artist, Long artistId, String album, String genre) throws IOException {
        // Save file locally
    
        // --- 4. SAVE THE AUDIO FILE ---
        // Create a unique filename for audio to prevent overwrites
        String audioFileName = UUID.randomUUID().toString() + "_" + audioFile.getOriginalFilename();
        String audioFilePath = musicUploadDir + "/" + audioFileName;
        Files.copy(audioFile.getInputStream(), Paths.get(audioFilePath), StandardCopyOption.REPLACE_EXISTING);

        // --- 5. SAVE THE COVER IMAGE FILE ---
        // Create a unique filename for the cover
        String coverFileName = UUID.randomUUID().toString() + "_" + coverImageFile.getOriginalFilename();
        String coverFilePath = coverUploadDir + "/" + coverFileName;
        Files.copy(coverImageFile.getInputStream(), Paths.get(coverFilePath), StandardCopyOption.REPLACE_EXISTING);

        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setArtistId(artistId);
        song.setAlbum(album);
        song.setGenre(genre);
        song.setFileUrl(audioFilePath); // Path to the audio
        song.setCoverImageUrl(coverFilePath); // <-- 6. SET THE COVER IMAGE PATH
        song.setPlayCount(0L);
        song.setUploadDate(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS));
        song.setDurationSeconds(0); // You can calculate this later if needed
        Song savedSong = songRepository.save(song);
        indexSongInElasticsearch(savedSong);

        // Send notification to RabbitMQ
        String message = "New song uploaded by " + artist + ": " + title;
        rabbitTemplate.convertAndSend(RabbitMQConstants.MUSIC_EXCHANGE, RabbitMQConstants.SONG_UPLOADED_ROUTING_KEY, message);

        System.out.println("📤 Sent message to RabbitMQ: " + message);
        log.info("📤 Sent message to RabbitMQ: " + message);

        return savedSong;
    }

    public byte[] downloadSong(String id) throws IOException {
        // 1. Trova la canzone nel database principale
        Song song = songRepository.findById(id).orElseThrow();
        
        long newPlayCount = song.getPlayCount() + 1;

        // 2. Aggiorna il conteggio in Elasticsearch
        searchRepository.findById(id).ifPresent(doc -> {
            doc.setPlayCount(newPlayCount); // Usa il nuovo conteggio
            searchRepository.save(doc);
        });

        // 3. --- LA CORREZIONE ---
        //    Aggiorna il conteggio anche nel database principale
        song.setPlayCount(newPlayCount);
        songRepository.save(song); // <-- Salva l'aggiornamento

        return Files.readAllBytes(Paths.get(song.getFileUrl()));
    }

    public void deleteSong(String id) {
        Song song = songRepository.findById(id).orElseThrow();
        
        // Delete audio file
        try {
            Files.deleteIfExists(Paths.get(song.getFileUrl()));
        } catch (IOException e) {
            log.error("Failed to delete audio file: " + song.getFileUrl(), e);
        }
        
        // Delete cover image file
        if (song.getCoverImageUrl() != null && !song.getCoverImageUrl().isBlank()) {
            try {
                Files.deleteIfExists(Paths.get(song.getCoverImageUrl()));
            } catch (IOException e) {
                log.error("Failed to delete cover image: " + song.getCoverImageUrl(), e);
            }
        }
        
        songRepository.deleteById(id);
        // Delete from Elasticsearch
        searchRepository.deleteById(id);
    }

    public List<Song> getSongsByArtistId(Long artistId) {
        return songRepository.findByArtistId(artistId);
    }

    public Song getSongById(String id) {
        return songRepository.findById(id).orElseThrow();
    }

    public Song updateSong(String id, Song updatedSong) {
        Song existingSong = songRepository.findById(id).orElseThrow();

        if (updatedSong.getTitle() != null && !updatedSong.getTitle().isBlank()) {
            existingSong.setTitle(updatedSong.getTitle());
        }
        if (updatedSong.getAlbum() != null && !updatedSong.getAlbum().isBlank()) {
            existingSong.setAlbum(updatedSong.getAlbum());
        }
        if (updatedSong.getGenre() != null && !updatedSong.getGenre().isBlank()) {
            existingSong.setGenre(updatedSong.getGenre());
        }

        indexSongInElasticsearch(existingSong);
        return songRepository.save(existingSong);
    }

    // Helper method to index song in Elasticsearch
    private void indexSongInElasticsearch(Song song) {
        SongDocument doc = new SongDocument();
        doc.setId(song.getId());
        doc.setTitle(song.getTitle());
        doc.setArtist(song.getArtist());
        doc.setArtistId(song.getArtistId());
        doc.setAlbum(song.getAlbum());
        doc.setGenre(song.getGenre());
        doc.setCoverImageUrl(song.getCoverImageUrl());
        doc.setPlayCount(song.getPlayCount());
        // Convert LocalDateTime to OffsetDateTime with system default zone
        LocalDateTime ldt = song.getUploadDate() != null ? song.getUploadDate() : LocalDateTime.now();
        doc.setUploadDate(ldt.atZone(ZoneId.systemDefault()).toOffsetDateTime());
        doc.setPlayCount(song.getPlayCount());
        doc.setLikedBy(song.getLikedBy());

        if(searchRepository.findById(doc.getId()).isPresent()) {
            searchRepository.deleteById(doc.getId());
        }

        searchRepository.save(doc);
    }

    /**
     * Adds a user's ID to the song's likedBy collection and re-indexes the song.
     * @param songId The ID of the song to like.
     * @param userId The ID of the user liking the song.
     */
    public void likeSong(String songId, Long userId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found with ID: " + songId));

        if (song.getLikedBy().add(userId)) { // .add() returns true if the set was changed
            songRepository.save(song);
            indexSongInElasticsearch(song); // Ensure this method re-indexes the new state
            log.info("User {} liked song {}", userId, songId);
        } else {
            log.warn("User {} already liked song {}", userId, songId);
        }
    }

    /**
     * Removes a user's ID from the song's likedBy collection and re-indexes the song.
     * @param songId The ID of the song to unlike.
     * @param userId The ID of the user unliking the song.
     */
    public void unlikeSong(String songId, Long userId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found with ID: " + songId));

        if (song.getLikedBy().remove(userId)) { // .remove() returns true if the set was changed
            songRepository.save(song);
            indexSongInElasticsearch(song); // Ensure this method re-indexes the new state
            log.info("User {} unliked song {}", userId, songId);
        } else {
            log.warn("User {} has not liked song {}", userId, songId);
        }
    }

    /**
     * Finds all songs liked by a specific user.
     * @param userId The ID of the user.
     * @return A list of songs liked by the user.
     */
    public List<Song> getLikedSongs(Long userId) {
        return songRepository.findByLikedByContains(userId);
    }
}
