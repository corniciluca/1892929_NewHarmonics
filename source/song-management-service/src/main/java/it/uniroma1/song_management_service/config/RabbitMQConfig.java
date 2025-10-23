package it.uniroma1.song_management_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange musicExchange() {       // for receiving song upload messages
        return new TopicExchange(RabbitMQConstants.MUSIC_EXCHANGE);
    }

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(RabbitMQConstants.USER_EXCHANGE);
    }

    @Bean
    public Queue userDeletedQueue() {
        return new Queue(RabbitMQConstants.USER_DELETED_QUEUE, true); // durable queue
    }

    @Bean
    public Binding userDeletedBinding(Queue userDeletedQueue, TopicExchange userExchange) {
        return BindingBuilder
                .bind(userDeletedQueue)
                .to(userExchange)
                .with(RabbitMQConstants.USER_DELETED_ROUTING_KEY);
    }

}
