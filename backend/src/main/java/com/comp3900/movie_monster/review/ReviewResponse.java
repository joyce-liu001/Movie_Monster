package com.comp3900.movie_monster.review;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class ReviewResponse {
    @JsonProperty("reviewId")
    private String reviewId;
    private String reviewString;
    private String userId;
    private String movieId;
    private double rating;
    private long timeSent;
    // key is UserId
    private List<String> thumbUp = new ArrayList<>();
    private List<String> thumbDown = new ArrayList<>();

}
