package com.newnop.tasktracker.service;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.PagedResponse;
import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.entity.Task;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    TaskResponse createTask(TaskRequest request, String username);

    TaskResponse getTaskById(Long id, String username);

    PagedResponse<TaskResponse> getTasks(Task.TaskStatus status, Long ownerId, Pageable pageable,
                                         String username, boolean isAdmin);

    TaskResponse updateTask(Long id, TaskRequest request, String username);

    void deleteTask(Long id, String username);
}
