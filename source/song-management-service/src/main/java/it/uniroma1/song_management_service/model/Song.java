package it.uniroma1.song_management_service.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "songs")
public class Song {
    @Id
    private String id;
    private String title;
    private String artist;
    private Long artistId;
    private String album;
    private String genre;
    private String fileUrl; // URL or path to file
    private Long playCount;
    private Integer durationSeconds;
    private LocalDateTime uploadDate;


}
