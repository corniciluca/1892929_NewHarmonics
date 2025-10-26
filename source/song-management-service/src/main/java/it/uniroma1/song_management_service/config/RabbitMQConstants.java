package it.uniroma1.song_management_service.config;

public class RabbitMQConstants {
    public static final String MUSIC_EXCHANGE = "music.exchange";
    public static final String SONG_UPLOADED_ROUTING_KEY = "song.uploaded";
    public static final String SONG_UPLOADED_QUEUE = "song.uploaded.notifications";
    public static final String SONG_PLAYED_ROUTING_KEY = "song.played";
    public static final String SONG_PLAYED_QUEUE = "song.played";
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String USER_DELETED_ROUTING_KEY = "user.deleted";
    public static final String USER_DELETED_QUEUE = "user.deleted.notifications";
}
