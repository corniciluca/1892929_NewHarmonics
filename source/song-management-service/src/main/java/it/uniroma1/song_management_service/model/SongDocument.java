package it.uniroma1.song_management_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(indexName = "songs")
public class SongDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String artist;

    @Field(type = FieldType.Keyword) // Keyword è ottimo per gli ID
    private Long artistId;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String album;
    
    @Field(type = FieldType.Keyword)
    private String genre;
    
    @Field(type = FieldType.Long)
    private Long playCount;
    
    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private OffsetDateTime uploadDate;
    
    @Field(type = FieldType.Integer)
    private Integer durationSeconds;

    @Field(type = FieldType.Long)
    private Set<Long> likedBy = new HashSet<>();
    
    // Constructors
    public SongDocument() {}
    
    public SongDocument(String id, String title, String artist, Long artistId, String album, 
                       String genre, Long playCount, OffsetDateTime uploadDate, 
                       Integer durationSeconds, Set<Long> likedBy) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.artistId = artistId;
        this.album = album;
        this.genre = genre;
        this.playCount = playCount;
        this.uploadDate = uploadDate;
        this.durationSeconds = durationSeconds;
        this.likedBy = likedBy;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getArtist() {
        return artist;
    }
    
    public void setArtist(String artist) {
        this.artist = artist;
    }

    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }
    
    public String getAlbum() {
        return album;
    }
    
    public void setAlbum(String album) {
        this.album = album;
    }
    
    public String getGenre() {
        return genre;
    }
    
    public void setGenre(String genre) {
        this.genre = genre;
    }
    
    public Long getPlayCount() {
        return playCount;
    }
    
    public void setPlayCount(Long playCount) {
        this.playCount = playCount;
    }
    
    public OffsetDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(OffsetDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public Integer getDurationSeconds() {
        return durationSeconds;
    }
    
    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Set<Long> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<Long> likedBy) {
        this.likedBy = likedBy;
    }
}