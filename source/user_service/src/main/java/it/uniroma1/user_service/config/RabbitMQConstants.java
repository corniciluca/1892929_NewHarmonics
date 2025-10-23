package it.uniroma1.user_service.config;

public class RabbitMQConstants {
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String USER_DELETED_ROUTING_KEY = "user.deleted";
    public static final String USER_DELETED_QUEUE = "user.deleted.notifications";
}
