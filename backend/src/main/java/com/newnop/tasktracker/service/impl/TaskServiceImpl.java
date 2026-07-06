package com.newnop.tasktracker.service.impl;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.entity.Task;
import com.newnop.tasktracker.entity.User;
import com.newnop.tasktracker.exception.ResourceNotFoundException;
import com.newnop.tasktracker.exception.UnauthorizedException;
import com.newnop.tasktracker.mapper.TaskMapper;
import com.newnop.tasktracker.repository.TaskRepository;
import com.newnop.tasktracker.repository.UserRepository;
import com.newnop.tasktracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, String username) {
        User user = findUser(username);
        Task task = taskMapper.toEntity(request);
        task.setUser(user);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, String username) {
        Task task = findTask(id);
        validateOwnership(task, username);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksForUser(String username) {
        User user = findUser(username);
        return taskRepository.findByUserId(user.getId()).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, String username) {
        Task task = findTask(id);
        validateOwnership(task, username);
        taskMapper.updateEntity(task, request);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public void deleteTask(Long id, String username) {
        Task task = findTask(id);
        validateOwnership(task, username);
        taskRepository.delete(task);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    private void validateOwnership(Task task, String username) {
        if (!task.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to access this task");
        }
    }
}
