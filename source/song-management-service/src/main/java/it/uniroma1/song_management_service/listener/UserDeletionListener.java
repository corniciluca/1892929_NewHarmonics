package it.uniroma1.song_management_service.listener;

import it.uniroma1.song_management_service.config.RabbitMQConfig;
import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;
import java.util.Map;

@Component
public class UserDeletionListener {

    private final SongRepository songRepository;
    private static final Logger log = LoggerFactory.getLogger(UserDeletionListener.class);

    public UserDeletionListener(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @RabbitListener(queues = RabbitMQConstants.USER_DELETED_QUEUE)
    public void handleUserDeleted(Long userId) {
        log.info("Received user-deleted event for user {}", userId);

        List<Song> songs = songRepository.findByArtistIdIn(List.of(userId));
        for (Song song : songs) {
            // Delete local file
            new File(song.getFileUrl()).delete();

            // Delete from MongoDB
            songRepository.deleteById(song.getId());
            log.info("Deleted song '{}' by user {}", song.getTitle(), userId);
        }
    }
}

