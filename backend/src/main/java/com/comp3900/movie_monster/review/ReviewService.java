package com.comp3900.movie_monster.review;

import com.comp3900.movie_monster.movie.Movie;
import org.springframework.http.ResponseEntity;


public interface ReviewService {

    void insertReview(Review review);

    void deleteReview(Review review);

    Review searchId(String reviewId);

    String insertMovie(Movie movie);

    Movie searchMovieId(String movieId);

    ResponseEntity<ReviewResponse> editReview(String token, String reviewId, double rating, String reviewString);

    ResponseEntity<ReviewResponse> thumbsUp(String token, String reviewId);

    ResponseEntity<ReviewResponse> thumbsDown(String token, String reviewId);

    ResponseEntity<ReviewResponse> removeReview(String token, String reviewId);
}
