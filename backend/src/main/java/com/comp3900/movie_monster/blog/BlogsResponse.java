package com.comp3900.movie_monster.blog;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@SuppressWarnings("Lombok")
@Data
@AllArgsConstructor
public class BlogsResponse {
    @JsonProperty("blogId")
    private String blogId;
    private String title;
    private String content;
    private long timeCreated;
    private String senderId;
    private String senderUsername;

    public BlogsResponse(Blog blog) {
        this.blogId = blog.getBlogId();
        this.title = blog.getTitle();
        this.content = blog.getContent();
        this.timeCreated = blog.getTimeCreated();
        this.senderId = blog.getSenderId();
        this.senderUsername = blog.getSenderUsername();
    }
}
