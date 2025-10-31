package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.repository.SongRepository;
import it.uniroma1.song_management_service.repository.SongSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Objects;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;

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

        // --- 1. Calculate Duration ---
        File tempAudioFile = null;
        int durationInSeconds = 0;
        try {
            // Create a temporary file to analyze
            tempAudioFile = File.createTempFile("upload-", "-" + audioFile.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(tempAudioFile)) {
                fos.write(audioFile.getBytes());
            }

            // Read the audio file's metadata
            AudioFile f = AudioFileIO.read(tempAudioFile);
            AudioHeader header = f.getAudioHeader();
            durationInSeconds = header.getTrackLength(); // This gives duration in seconds

        } catch (Exception e) {
            log.error("Could not read audio file duration", e);
            // We'll proceed with 0, but log the error
        } finally {
            // Clean up the temporary file
            if (tempAudioFile != null && tempAudioFile.exists()) {
                tempAudioFile.delete();
            }
        }
        // --- End of Duration Calculation ---

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
        song.setDurationSeconds(durationInSeconds); // You can calculate this later if needed
        
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

//      UNUSED
//    public Song updateSong(String id, Song updatedSong) {
//        Song existingSong = songRepository.findById(id).orElseThrow();
//
//        if (updatedSong.getTitle() != null && !updatedSong.getTitle().isBlank()) {
//            existingSong.setTitle(updatedSong.getTitle());
//        }
//        if (updatedSong.getAlbum() != null && !updatedSong.getAlbum().isBlank()) {
//            existingSong.setAlbum(updatedSong.getAlbum());
//        }
//        if (updatedSong.getGenre() != null && !updatedSong.getGenre().isBlank()) {
//            existingSong.setGenre(updatedSong.getGenre());
//        }
//
//        indexSongInElasticsearch(existingSong);
//        return songRepository.save(existingSong);
//    }

    /**
     * Updates a song's details, and optionally replaces its audio or cover image.
     * This method handles deleting old files from MinIO if new ones are provided.
     */
    public Song updateSongDetails(String id, String title, String album, String genre, MultipartFile audioFile, MultipartFile coverImageFile) throws Exception {

        Song existingSong = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found with ID: " + id));

        // Update text fields
        existingSong.setTitle(title);
        existingSong.setAlbum(album);
        existingSong.setGenre(genre);

        boolean fileChanged = false;

        // Check and update Audio File
        if (audioFile != null && !audioFile.isEmpty()) {
            fileChanged = true;
            log.info("Replacing audio file for song: {}", id);

            // Delete old audio file from MinIO
            try {
                minioService.deleteFile(existingSong.getFileUrl());
            } catch (Exception e) {
                log.warn("Could not delete old audio file, proceeding: {}", e.getMessage());
            }

            // Upload new audio file
            String newAudioObjectName = minioService.uploadFile(audioFile);
            existingSong.setFileUrl(newAudioObjectName);

            // --- Recalculate Duration ---
            File tempAudioFile = null;
            try {
                tempAudioFile = File.createTempFile("update-", "-" + audioFile.getOriginalFilename());
                try (FileOutputStream fos = new FileOutputStream(tempAudioFile)) {
                    fos.write(audioFile.getBytes());
                }
                AudioFile f = AudioFileIO.read(tempAudioFile);
                AudioHeader header = f.getAudioHeader();
                existingSong.setDurationSeconds(header.getTrackLength());
                log.info("New duration calculated: {}s", header.getTrackLength());
            } finally {
                if (tempAudioFile != null && tempAudioFile.exists()) {
                    tempAudioFile.delete();
                }
            }
        }

        // Check and update Cover Image
        if (coverImageFile != null && !coverImageFile.isEmpty()) {
            fileChanged = true;
            log.info("Replacing cover image for song: {}", id);

            // Delete old cover image from MinIO
            if (existingSong.getCoverImageUrl() != null && !existingSong.getCoverImageUrl().isBlank()) {
                try {
                    minioService.deleteFile(existingSong.getCoverImageUrl());
                } catch (Exception e) {
                    log.warn("Could not delete old cover image, proceeding: {}", e.getMessage());
                }
            }

            // Upload new cover image
            String newCoverObjectName = minioService.uploadFile(coverImageFile);
            existingSong.setCoverImageUrl(newCoverObjectName);
        }

        if (fileChanged) {
            log.info("File changed, updating timestamp for song: {}", id);
            existingSong.setUploadDate(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS));
        }

        // Save to DB and Elasticsearch
        Song savedSong = songRepository.save(existingSong);
        indexSongInElasticsearch(savedSong);

        return savedSong;
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
        doc.setDurationSeconds(song.getDurationSeconds());
        // Convert LocalDateTime to OffsetDateTime with system default zone
        LocalDateTime ldt = song.getUploadDate() != null ? song.getUploadDate() : LocalDateTime.now();
        doc.setUploadDate(ldt.atZone(ZoneId.systemDefault()).toOffsetDateTime());
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
