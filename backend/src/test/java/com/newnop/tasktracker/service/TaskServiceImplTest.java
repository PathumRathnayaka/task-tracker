package com.newnop.tasktracker.service;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.entity.Task;
import com.newnop.tasktracker.entity.User;
import com.newnop.tasktracker.exception.UnauthorizedException;
import com.newnop.tasktracker.mapper.TaskMapper;
import com.newnop.tasktracker.repository.TaskRepository;
import com.newnop.tasktracker.repository.UserRepository;
import com.newnop.tasktracker.service.impl.TaskServiceImpl;
import com.newnop.tasktracker.websocket.TaskNotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TaskMapper taskMapper;
    @Mock
    private TaskNotificationService notificationService;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTaskSavesAndBroadcasts() {
        TaskRequest request = new TaskRequest();
        request.setTitle("Write tests");
        request.setStatus(Task.TaskStatus.TODO);
        request.setPriority(Task.Priority.MEDIUM);

        User user = User.builder().id(1L).username("bob").build();
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(user));
        Task entity = Task.builder().build();
        when(taskMapper.toEntity(request)).thenReturn(entity);
        Task saved = Task.builder().id(5L).user(user).build();
        when(taskRepository.save(entity)).thenReturn(saved);
        TaskResponse response = TaskResponse.builder().id(5L).build();
        when(taskMapper.toResponse(saved)).thenReturn(response);

        TaskResponse result = taskService.createTask(request, "bob");

        assertEquals(5L, result.getId());
        verify(notificationService).notifyTaskCreated(response);
    }

    @Test
    void getTaskByIdDeniedForNonOwner() {
        User owner = User.builder().id(1L).username("owner").build();
        Task task = Task.builder().id(5L).user(owner).build();
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task));

        assertThrows(UnauthorizedException.class, () -> taskService.getTaskById(5L, "intruder", false));
    }

    @Test
    void adminCanDeleteAnyTask() {
        User owner = User.builder().id(1L).username("owner").build();
        Task task = Task.builder().id(5L).user(owner).build();
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task));

        taskService.deleteTask(5L, "admin", true);

        verify(taskRepository).delete(task);
        verify(notificationService).notifyTaskDeleted(5L);
    }
}
