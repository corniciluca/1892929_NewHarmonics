package it.uniroma1.song_management_service.config;

public class RabbitMQConstants {
    public static final String EXCHANGE = "music.exchange";
    public static final String ROUTING_KEY = "song.uploaded";
    public static final String QUEUE = "song.uploaded.notifications";
    public static final String USER_FOLLOW_QUEUE = "user.follow.queue";
    public static final String USER_FOLLOW_EXCHANGE = "user.follow.exchange";
    public static final String USER_FOLLOW_ROUTING_KEY = "user.followed";
}
