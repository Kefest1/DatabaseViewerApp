package org.example;



import com.rabbitmq.client.*;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;

import java.io.IOException;
import java.util.concurrent.TimeoutException;


public class Main {
    private static final String QUEUE_NAME = "jt_queue";
    static String host = "localhost"; // RabbitMQ server host
    static int port = 5672; // RabbitMQ server port
    static String username = "rabbitmquser"; // RabbitMQ username
    static String password = "rabbitmqpassword"; // RabbitMQ password
    static String queueName = "jt_queue"; // Name of the queue

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost"); // Use the RabbitMQ container's hostname or IP
        factory.setUsername("rabbitmquser");
        factory.setPassword("rabbitmqpassword");

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println(" [x] Received '" + message + "'");
            };

            channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {
            });
        }
    }

    private static void CreateMsgQueue() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            // Declare the queue
            channel.queueDeclare(queueName, true, false, false, null);

            System.out.println("Queue '" + queueName + "' created successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}