package com.newnop.tasktracker.util;

public final class Constants {

    private Constants() {
    }

    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    public static final String TOPIC_TASK_CREATED = "/topic/tasks/created";
    public static final String TOPIC_TASK_UPDATED = "/topic/tasks/updated";
    public static final String TOPIC_TASK_DELETED = "/topic/tasks/deleted";

    public static final int DEFAULT_PAGE_SIZE = 20;
}
