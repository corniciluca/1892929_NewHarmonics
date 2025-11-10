package it.uniroma1.notification_service.listener;

import it.uniroma1.notification_service.config.RabbitMQConstants;
import it.uniroma1.notification_service.service.NotificationService;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SongEventListener {

    private static final Logger log = LoggerFactory.getLogger(SongEventListener.class);
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public SongEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
        this.objectMapper = new ObjectMapper();
    }
    
    @RabbitListener(queues = RabbitMQConstants.QUEUE)
    public void handleSongUploaded(String message) {
       log.info("🎵 New song uploaded event received: " + message);
        
        try {
            Map<String, Object> eventData = objectMapper.readValue(message, Map.class);
            
            Long artistId = ((Number) eventData.get("artistId")).longValue();
            String artistName = (String) eventData.get("artistName");
            String songTitle = (String) eventData.get("songTitle");
            String songId = (String) eventData.get("songId");
            
            notificationService.createNotificationsForArtistFollowers(
                artistId, artistName, songTitle, songId
            );
            
            log.info("✅ Created notifications for artist {} followers", artistName);
            
        } catch (Exception e) {
            log.error("❌ Failed to process song uploaded event", e);
        }
    }
}
