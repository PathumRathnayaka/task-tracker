package com.newnop.tasktracker.service.impl;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.PagedResponse;
import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.entity.Task;
import com.newnop.tasktracker.entity.User;
import com.newnop.tasktracker.exception.ResourceNotFoundException;
import com.newnop.tasktracker.exception.UnauthorizedException;
import com.newnop.tasktracker.mapper.TaskMapper;
import com.newnop.tasktracker.repository.TaskRepository;
import com.newnop.tasktracker.repository.TaskSpecifications;
import com.newnop.tasktracker.repository.UserRepository;
import com.newnop.tasktracker.service.TaskService;
import com.newnop.tasktracker.websocket.TaskNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TaskNotificationService notificationService;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, String username) {
        User user = findUser(username);
        Task task = taskMapper.toEntity(request);
        task.setUser(user);
        TaskResponse response = taskMapper.toResponse(taskRepository.save(task));
        notificationService.notifyTaskCreated(response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, String username, boolean isAdmin) {
        Task task = findTask(id);
        validateAccess(task, username, isAdmin);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getTasks(Task.TaskStatus status, Long ownerId, Pageable pageable,
                                                String username, boolean isAdmin) {
        Long effectiveOwnerId = isAdmin ? ownerId : findUser(username).getId();
        Specification<Task> spec = TaskSpecifications.withFilters(status, effectiveOwnerId);
        Page<TaskResponse> page = taskRepository.findAll(spec, pageable).map(taskMapper::toResponse);
        return PagedResponse.from(page);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, String username, boolean isAdmin) {
        Task task = findTask(id);
        validateAccess(task, username, isAdmin);
        taskMapper.updateEntity(task, request);
        TaskResponse response = taskMapper.toResponse(taskRepository.save(task));
        notificationService.notifyTaskUpdated(response);
        return response;
    }

    @Override
    @Transactional
    public void deleteTask(Long id, String username, boolean isAdmin) {
        Task task = findTask(id);
        validateAccess(task, username, isAdmin);
        taskRepository.delete(task);
        notificationService.notifyTaskDeleted(id);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    private void validateAccess(Task task, String username, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        if (!task.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to access this task");
        }
    }
}
