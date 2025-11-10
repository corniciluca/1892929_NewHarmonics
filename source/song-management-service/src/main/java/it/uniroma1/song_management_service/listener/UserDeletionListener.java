package it.uniroma1.song_management_service.listener;

import it.uniroma1.song_management_service.config.RabbitMQConfig;
import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.repository.SongRepository;
import it.uniroma1.song_management_service.service.SongService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;
import java.util.Map;

@Component
public class UserDeletionListener {

    private static final Logger log = LoggerFactory.getLogger(UserDeletionListener.class);
    private final SongService songService;

    public UserDeletionListener(SongService songService) {
        this.songService = songService;
    }

    @RabbitListener(queues = RabbitMQConstants.USER_DELETED_QUEUE)
    public void handleUserDeleted(Long userId) {
        log.info("Received user-deleted event for user ID: {}", userId);
        songService.deleteAllSongsByArtist(userId);
    }
}

