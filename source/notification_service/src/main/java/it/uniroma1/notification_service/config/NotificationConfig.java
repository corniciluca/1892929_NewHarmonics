package it.uniroma1.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationConfig {

    public static final String SONG_UPLOADED_QUEUE = "song.uploaded";
    public static final String EXCHANGE = "music.exchange";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return new Queue(SONG_UPLOADED_QUEUE, true);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("song.uploaded");
    }
}
