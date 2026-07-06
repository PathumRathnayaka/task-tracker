package com.newnop.tasktracker.websocket;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class TaskWebSocketController {

    private final TaskService taskService;

    @MessageMapping("/tasks.create")
    public void createTask(@Payload TaskRequest request, Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("Unauthenticated WebSocket session");
        }
        taskService.createTask(request, principal.getName());
    }
}
