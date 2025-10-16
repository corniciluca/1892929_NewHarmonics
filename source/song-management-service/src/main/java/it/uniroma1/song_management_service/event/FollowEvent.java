package it.uniroma1.song_management_service.event;

import java.io.Serializable;

public class FollowEvent implements Serializable {
    private String type;  // "FOLLOW_EVENT" or "UNFOLLOW_EVENT"
    private Long userId;
    private Long artistId;

    public FollowEvent() {}

    public FollowEvent(String type, Long userId, Long artistId) {
        this.type = type;
        this.userId = userId;
        this.artistId = artistId;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }
}
