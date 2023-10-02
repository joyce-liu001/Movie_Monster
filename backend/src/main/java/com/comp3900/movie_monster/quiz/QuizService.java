package com.comp3900.movie_monster.quiz;

import com.comp3900.movie_monster.review.ReviewResponse;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;


public interface QuizService {
    ResponseEntity<ReviewResponse> createQuiz(String token, String quizTitle, String quizSynopsis, String quizContent, String movieId);

    ResponseEntity<ReviewResponse> editQuiz(String token, String quizSynopsis, String quizContent, String movieId);

    ResponseEntity<ReviewResponse> removeQuiz(String token, String movieId);

    ResponseEntity<HashMap<String, QuizResponse>> details(String movieId);
}
