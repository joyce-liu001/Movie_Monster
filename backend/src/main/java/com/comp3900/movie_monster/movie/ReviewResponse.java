package com.comp3900.movie_monster.movie;

import com.comp3900.movie_monster.actor.Actor;
import com.comp3900.movie_monster.director.Director;
import com.comp3900.movie_monster.review.Review;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
public class ReviewResponse {
    @JsonProperty("reviewId")
    private String reviewId;
    private String reviewerId;
    private String reviewerUsername;
    private Double rating;
    private String reviewString;
    private Integer numThumbsUp;
    private long timeSent;
    private Integer numThumbsDown;
    private Boolean isThisUserThumbsUp = false;
    private Boolean isThisUserThumbsDown = false;

    public ReviewResponse(Review review) {
        this.reviewId = review.getReviewId();
        this.reviewerId = review.getUserId();
        this.rating = review.getRating();
        this.reviewString = review.getReviewString();
        this.numThumbsDown = review.getThumbDown().size();
        this.numThumbsUp = review.getThumbUp().size();
        this.timeSent = review.getTimeSent();
    }
}

