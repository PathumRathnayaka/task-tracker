package com.newnop.tasktracker.controller;

import com.newnop.tasktracker.dto.request.TaskRequest;
import com.newnop.tasktracker.dto.response.ApiResponse;
import com.newnop.tasktracker.dto.response.PagedResponse;
import com.newnop.tasktracker.dto.response.TaskResponse;
import com.newnop.tasktracker.entity.Task;
import com.newnop.tasktracker.service.TaskService;
import com.newnop.tasktracker.util.Constants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskResponse response = taskService.createTask(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskResponse response = taskService.getTaskById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TaskResponse>>> getTasks(
            @RequestParam(required = false) Task.TaskStatus status,
            @RequestParam(required = false) Long ownerId,
            @PageableDefault(size = Constants.DEFAULT_PAGE_SIZE, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = hasAdminRole(userDetails);
        PagedResponse<TaskResponse> tasks = taskService.getTasks(
                status, ownerId, pageable, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", tasks));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TaskResponse response = taskService.updateTask(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }

    private boolean hasAdminRole(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(Constants.ROLE_ADMIN));
    }
}
