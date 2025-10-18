package it.uniroma1.song_management_service.service;

import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final String uploadDir = "/app/music/";
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(SongService.class);

    public SongService(SongRepository songRepository, RabbitTemplate rabbitTemplate) {
        this.songRepository = songRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Song uploadSong(MultipartFile file, String title, String artist, Long artistId, String album, String genre) throws IOException {
        // Save file locally
        String filePath = uploadDir + file.getOriginalFilename();
        Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);

        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setArtistId(artistId);
        song.setAlbum(album);
        song.setGenre(genre);
        song.setFileUrl(filePath);

        Song savedSong = songRepository.save(song);

        // Send notification to RabbitMQ
        String message = "New song uploaded by " + artist + ": " + title;
        rabbitTemplate.convertAndSend(RabbitMQConstants.MUSIC_EXCHANGE, RabbitMQConstants.SONG_UPLOADED_ROUTING_KEY, message);

        System.out.println("📤 Sent message to RabbitMQ: " + message);
        log.info("📤 Sent message to RabbitMQ: " + message);

        return savedSong;
    }

    public byte[] downloadSong(String id) throws IOException {
        Song song = songRepository.findById(id).orElseThrow();
        return Files.readAllBytes(Paths.get(song.getFileUrl()));
    }

    public void deleteSong(String id) {
        Song song = songRepository.findById(id).orElseThrow();
        new File(song.getFileUrl()).delete();
        songRepository.deleteById(id);
    }

    public List<Song> getSongsByArtistId(Long artistId) {
        return songRepository.findByArtistId(artistId);
    }
}
