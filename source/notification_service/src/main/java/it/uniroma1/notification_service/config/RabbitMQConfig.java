package it.uniroma1.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(RabbitMQConstants.EXCHANGE);
    }

    @Bean
    public Queue songUploadedQueue() {
        return new Queue(RabbitMQConstants.QUEUE, true);
    }

    @Bean
    public Binding binding(Queue songUploadedQueue, TopicExchange exchange) {
        return BindingBuilder.bind(songUploadedQueue)
                .to(exchange)
                .with(RabbitMQConstants.ROUTING_KEY);
    }
}
