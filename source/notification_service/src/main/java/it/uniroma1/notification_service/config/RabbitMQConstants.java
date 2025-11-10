package it.uniroma1.notification_service.config;

public class RabbitMQConstants {
    public static final String EXCHANGE = "music.exchange";
    public static final String ROUTING_KEY = "song.uploaded";
    public static final String QUEUE = "song.uploaded.notifications";
}
