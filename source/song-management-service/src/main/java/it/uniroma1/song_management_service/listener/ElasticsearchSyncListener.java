package it.uniroma1.song_management_service.listener;


import it.uniroma1.song_management_service.config.RabbitMQConstants;
import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.model.SongDocument;
import it.uniroma1.song_management_service.service.SongSearchService;

import java.time.ZoneId;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ElasticsearchSyncListener {
    
    @Autowired
    private SongSearchService searchService;
    
    // Listen for song uploads
    @RabbitListener(queues = RabbitMQConstants.SONG_UPLOADED_ROUTING_KEY)
    public void handleSongUploaded(Song song) {
        // Convert MongoDB Song to Elasticsearch SongDocument
        SongDocument doc = new SongDocument(
            song.getId(),
            song.getTitle(),
            song.getArtist(),
            song.getAlbum(),
            song.getGenre(),
            0L, // Initial play count
            song.getUploadDate().atZone(ZoneId.systemDefault()).toOffsetDateTime(),
            song.getDurationSeconds()
        );
        
        searchService.indexSong(doc);
        System.out.println("Indexed song: " + song.getTitle());
    }
    
    // Listen for song plays
    @RabbitListener(queues = "song.played")
    public void handleSongPlayed(String songId) {
        searchService.incrementPlayCount(songId);
    }
}