package com.comp3900.movie_monster.notification;

import com.comp3900.movie_monster.review.Review;
import lombok.AllArgsConstructor;
import lombok.Data;

@SuppressWarnings("Lombok")
@Data
@AllArgsConstructor
public class NotificationResponse {
    private String notificationType = null;
    private String movieId = null;
    private String reviewId = null;
    private String blogId = null;
    public NotificationResponse(Notification notification) {
        this.notificationType = notification.getType();
        this.movieId = notification.getMovieId();
        this.reviewId = notification.getReviewId();
        this.blogId = notification.getBlogId();
    }
}
