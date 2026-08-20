package com.medique.service;

import com.medique.dto.response.QueueTrackingResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueueWebSocketService {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public QueueWebSocketService(SimpMessagingTemplate simpMessagingTemplate){
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void publishQueueUpdate(String doctorCode, QueueTrackingResponse response){
        simpMessagingTemplate.convertAndSend("/topic/queue/"+doctorCode, response);
    }
}
