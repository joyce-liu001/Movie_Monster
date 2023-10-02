package com.comp3900.movie_monster.blog;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.comp3900.movie_monster.notification.*;
import com.comp3900.movie_monster.user.*;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class Blog {
    @MongoId
    private String blogId = UUID.randomUUID().toString();
    private String title;
    private String content;
    private List<String> movieIdList = new ArrayList<>();
    private Date date = new Date();
    private long timeCreated = this.date.getTime();
    private String senderId;
    private String senderUsername;
    public Blog(String title, String content, List<String> movieIdList, User user) {
        this.title = title;
        this.content = content;
        this.movieIdList = movieIdList;
        this.senderUsername = user.getUsername();
        this.senderId = user.getUserId();
    }
}
