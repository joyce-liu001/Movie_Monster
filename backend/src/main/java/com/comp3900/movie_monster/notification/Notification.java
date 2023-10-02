package com.comp3900.movie_monster.notification;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Data
@AllArgsConstructor
public class Notification {
    @MongoId
    private String id = null;
    private String srcId = null;
    private String toId = null;
    private String type = null;
    private String movieId = null;
    private String reviewId = null;
    private String blogId = null;
    public Notification(String type, String srcId, String toId) {
        this.type = type;
        this.srcId = srcId;
        this.toId = toId;
        this.id = UUID.randomUUID().toString();
    }
}
