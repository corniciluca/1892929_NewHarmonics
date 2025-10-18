package it.uniroma1.song_management_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange exchange() {       // for receiving song upload messages
        return new TopicExchange(RabbitMQConstants.EXCHANGE);
    }

}
