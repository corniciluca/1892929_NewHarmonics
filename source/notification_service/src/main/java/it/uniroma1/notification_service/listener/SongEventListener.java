package it.uniroma1.notification_service.listener;

import it.uniroma1.notification_service.config.RabbitMQConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class SongEventListener {

    private static final Logger log = LoggerFactory.getLogger(SongEventListener.class);

    @RabbitListener(queues = RabbitMQConstants.QUEUE)
    public void handleSongUploaded(String message) {
        System.out.println("🎵 New song uploaded event received: " + message);
        log.info("🎵 New song uploaded event received: " + message);
        // Here you'd look up followers of the artist and notify them
    }
}
