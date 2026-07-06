package com.newnop.tasktracker.websocket;

import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyTaskCreated(TaskResponse task) {
        messagingTemplate.convertAndSend(Constants.TOPIC_TASK_CREATED, task);
    }

    public void notifyTaskUpdated(TaskResponse task) {
        messagingTemplate.convertAndSend(Constants.TOPIC_TASK_UPDATED, task);
    }

    public void notifyTaskDeleted(Long taskId) {
        messagingTemplate.convertAndSend(Constants.TOPIC_TASK_DELETED, taskId);
    }
}
