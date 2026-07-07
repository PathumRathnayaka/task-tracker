package com.newnop.tasktracker.repository;

import com.newnop.tasktracker.entity.Task;
import com.newnop.tasktracker.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    void filtersByStatusAndOwner() {
        User user = userRepository.save(User.builder()
                .username("bob").email("bob@example.com").password("hashed").build());
        taskRepository.save(Task.builder()
                .title("todo task").status(Task.TaskStatus.TODO).priority(Task.Priority.LOW).user(user).build());
        taskRepository.save(Task.builder()
                .title("done task").status(Task.TaskStatus.DONE).priority(Task.Priority.HIGH).user(user).build());

        List<Task> result = taskRepository.findAll(
                TaskSpecifications.withFilters(Task.TaskStatus.TODO, user.getId()));

        assertEquals(1, result.size());
        assertEquals("todo task", result.get(0).getTitle());
    }
}
