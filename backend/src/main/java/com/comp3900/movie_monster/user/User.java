package com.comp3900.movie_monster.user;

import com.comp3900.movie_monster.blog.Blog;
import com.comp3900.movie_monster.friendrequest.FriendRequest;
import com.comp3900.movie_monster.notification.Notification;
import com.comp3900.movie_monster.movie.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.*;

@Data
@AllArgsConstructor
@Document
@NoArgsConstructor
public class User {
    @MongoId
    private String userId;
    private String username;
    @Indexed(unique = true)
    private String email;
    private String password;
    private String age;
    private String gender;
    private List<Movie> wishList = new ArrayList<>();
    private List<Movie> favouriteList = new ArrayList<>();
    private List<Movie> watchedList = new ArrayList<>();
    private boolean isAdmin = false;
    private String avatar;
    private List<String> tokens = new ArrayList<>();
    private Set<String> blockedUsers = new HashSet<>();
    private String userStatus;
    private String validationCode;
    private Date expirationDate;
    private String description;
    private String resetCode;
    // sprint 3
    private List<Blog> blogList = new ArrayList<>();
    private List<FriendRequest> friendRequestsList = new ArrayList<>();
    private List<Notification> notificationList = new ArrayList<>();
    private List<User> firendsList = new ArrayList<>();
}
