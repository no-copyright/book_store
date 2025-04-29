package com.hau.blogService.controller;

import com.hau.event.dto.CategoryEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Controller {
//    @KafkaListener(topics = "profile-create-event")
//    public void listen(ProfileCreateEvent event) {
//        log.info("Received ProfileCreateEvent: {}", event);
//    }

//    @KafkaListener(topics = "hello-event")
//    public void listen(Object event) {
//        log.info("Hello {}", event);
//    }

    private static final String TOPIC_CATEGORY_EVENTS = "category-events";

//    @KafkaListener(topics = "category-event")
    public void listen(CategoryEvent event) {
        log.info("comsume {}", event);
//        if(event.getType().equals("CATEGORY_CREATED"))
//            log.info("Hello");
    }
}
