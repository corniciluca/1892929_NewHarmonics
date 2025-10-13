package it.uniroma1.notification_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class SongEventListener {

    @RabbitListener(queues = "song.uploaded")
    public void handleSongUploaded(String message) {
        System.out.println("🎵 New song uploaded event received: " + message);
        // Here you'd look up followers of the artist and notify them
    }
}
