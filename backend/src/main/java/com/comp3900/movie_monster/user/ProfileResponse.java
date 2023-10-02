package com.comp3900.movie_monster.user;

import com.comp3900.movie_monster.movie.Movie;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;


@Data
@Setter
public class ProfileResponse {
    @JsonProperty("uId")
    private String uId;
    private String username;
    private String email;
    private List<Movie> wishList;
    private List<Movie> watchList;
    private List<Movie> favouriteList;
    private String userStatus;
    private Boolean isAdmin;

    private String gender;

    private String age;

    @JsonProperty("isBlocked")
    private boolean isBlocked;
    private String image;

    public ProfileResponse(User user) {
        this.uId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.wishList = user.getWishList();
        this.watchList = user.getWatchedList();
        this.favouriteList = user.getFavouriteList();
        this.isAdmin = user.isAdmin();
        this.userStatus = user.getUserStatus();
        this.gender = user.getGender();
        this.age = user.getAge();
    }

    public ProfileResponse(User user, String image) {
        this.uId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.wishList = user.getWishList();
        this.watchList = user.getWatchedList();
        this.favouriteList = user.getFavouriteList();
        this.isAdmin = user.isAdmin();
        this.userStatus = user.getUserStatus();
        this.gender = user.getGender();
        this.age = user.getAge();
        this.image = image;
    }
}
