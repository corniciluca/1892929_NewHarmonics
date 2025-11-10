package it.uniroma1.user_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

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
