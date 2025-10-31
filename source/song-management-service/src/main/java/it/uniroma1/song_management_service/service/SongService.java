package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.repository.SongRepository;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final SongSearchRepository searchRepository;
    private final RabbitTemplate rabbitTemplate;
    private final MinioService minioService;
    private static final Logger log = LoggerFactory.getLogger(SongService.class);

    public SongService(SongRepository songRepository, 
                      SongSearchRepository searchRepository, 
                      RabbitTemplate rabbitTemplate,
                      MinioService minioService) {
        this.songRepository = songRepository;
        this.searchRepository = searchRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.minioService = minioService;
        
        // Initialize MinIO bucket
        this.minioService.init();
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Song uploadSong(MultipartFile audioFile, MultipartFile coverImageFile, String title, String artist, Long artistId, String album, String genre) throws IOException {
        // Upload files to MinIO and get their object names
        String audioObjectName = minioService.uploadFile(audioFile);
        String coverObjectName = minioService.uploadFile(coverImageFile);

        // Create and save the song entity
        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setArtistId(artistId);
        song.setAlbum(album);
        song.setGenre(genre);
        song.setFileUrl(audioObjectName); // Store MinIO object name
        song.setCoverImageUrl(coverObjectName); // Store MinIO object name
        song.setPlayCount(0L);
        song.setUploadDate(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS));
        song.setDurationSeconds(0); // You can calculate this later if needed
        
        Song savedSong = songRepository.save(song);
        indexSongInElasticsearch(savedSong);
        
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> eventData = Map.of(
                    "artistId", artistId,
                    "artistName", artist,
                    "songTitle", title,
                    "songId", savedSong.getId(),
                    "coverUrl", coverObjectName
            );
            
            String message = objectMapper.writeValueAsString(eventData);
            rabbitTemplate.convertAndSend(
                    RabbitMQConstants.MUSIC_EXCHANGE, 
                    RabbitMQConstants.SONG_UPLOADED_ROUTING_KEY,
                    message
            );
                
                log.info("📤 Sent rich event to RabbitMQ for song: {}", title);
            } catch (Exception e) {
                log.error("Failed to send notification event", e);
            }

        return savedSong;
    }

    public byte[] downloadCoverImage(String id) throws IOException {
        Song song = songRepository.findById(id).orElseThrow();
        return minioService.getFile(song.getCoverImageUrl());
    }
    
    public byte[] downloadSong(String id) throws IOException {
        Song song = songRepository.findById(id).orElseThrow();
        
        long newPlayCount = song.getPlayCount() + 1;

        // Update Elasticsearch
        searchRepository.findById(id).ifPresent(doc -> {
            doc.setPlayCount(newPlayCount);
            searchRepository.save(doc);
        });

        // Update MongoDB
        song.setPlayCount(newPlayCount);
        songRepository.save(song);

        // Get file from MinIO
        return minioService.getFile(song.getFileUrl());
    }

    public void deleteSong(String id) {
        Song song = songRepository.findById(id).orElseThrow();
        
        // Delete files from MinIO
        try {
            minioService.deleteFile(song.getFileUrl());
            if (song.getCoverImageUrl() != null && !song.getCoverImageUrl().isBlank()) {
                minioService.deleteFile(song.getCoverImageUrl());
            }
        } catch (Exception e) {
            log.error("Failed to delete files from MinIO", e);
        }
        
        // Delete from MongoDB
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
