package com.newnop.tasktracker.service;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request, String username);

    TaskResponse getTaskById(Long id, String username);

    List<TaskResponse> getAllTasksForUser(String username);

    TaskResponse updateTask(Long id, TaskRequest request, String username);

    void deleteTask(Long id, String username);
}
