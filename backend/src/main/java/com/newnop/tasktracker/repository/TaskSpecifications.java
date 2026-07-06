package com.newnop.tasktracker.repository;

import com.newnop.tasktracker.entity.Task;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class TaskSpecifications {

    private TaskSpecifications() {
    }

    public static Specification<Task> withFilters(Task.TaskStatus status, Long ownerId) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(builder.equal(root.get("status"), status));
            }
            if (ownerId != null) {
                predicates.add(builder.equal(root.get("user").get("id"), ownerId));
            }
            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
