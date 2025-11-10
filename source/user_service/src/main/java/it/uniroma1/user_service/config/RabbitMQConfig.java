package it.uniroma1.user_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange userEventsExchange() {
        return new TopicExchange(RabbitMQConstants.USER_EXCHANGE);
    }

    @Bean
    public Queue userDeletedQueue() {
        return new Queue(RabbitMQConstants.USER_DELETED_QUEUE, true);
    }

    @Bean
    public Binding bindingUserDeleted(Queue userDeletedQueue, TopicExchange userEventsExchange) {
        return BindingBuilder.bind(userDeletedQueue)
                .to(userEventsExchange)
                .with(RabbitMQConstants.USER_DELETED_ROUTING_KEY);
    }
}
