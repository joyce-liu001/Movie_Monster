package com.comp3900.movie_monster.quiz;

import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.movie.Movie;
import com.comp3900.movie_monster.review.ReviewResponse;
import com.comp3900.movie_monster.user.User;
import com.comp3900.movie_monster.util.JwtUtil;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
@Repository("quizs")
@Service
public class QuizAccessService implements QuizService {
    private final JwtUtil jwtUtil = new JwtUtil();
    private static final String COLLECTION_NAME = "Quiz";
    private final MongoTemplate mongoTemplate;

    @Autowired
    public QuizAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    @Override
    public ResponseEntity<ReviewResponse> createQuiz(String token, String quizTitle, String quizSynopsis, String quizContent, String movieId) {
        Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (movie == null){
            throw new CustomException(400, "MovieId is invalid");
        }
        String userId = jwtUtil.getIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = mongoTemplate.findById(userId, User.class, "User");
        assert user != null;
        if (!user.isAdmin()) {
            throw new CustomException(403, "user is not an admin");
        }
        Quiz quiz = new Quiz();
        quiz.setQuizTitle(quizTitle);
        quiz.setQuizContent(quizContent);
        quiz.setQuizSynopsis(quizSynopsis);
        movie.setQuiz(quiz);
        mongoTemplate.save(quiz, COLLECTION_NAME);
        mongoTemplate.save(movie, "Movie");
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<ReviewResponse> editQuiz(String token, String quizSynopsis, String quizContent, String movieId) {
        String userId = jwtUtil.getIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = mongoTemplate.findById(userId, User.class, "User");
        if (!user.isAdmin()) {
            throw new CustomException(403, "user is not an admin");
        }
        if (quizSynopsis == null || quizContent == null) {
            throw new CustomException(400, "Invalid quizSynopsis or quizContent");
        }
        Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (movie == null) {
            throw new CustomException(400, "Invalid movie");
        }
        Quiz quiz = movie.getQuiz();
        quiz.setQuizContent(quizContent);
        quiz.setQuizSynopsis(quizSynopsis);
        movie.setQuiz(quiz);
        mongoTemplate.save(quiz, COLLECTION_NAME);
        mongoTemplate.save(movie, "Movie");
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<ReviewResponse> removeQuiz(String token, String movieId) {
        String userId = jwtUtil.getIdFromToken(token);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid token");
        }
        User user = mongoTemplate.findById(userId, User.class, "User");
        if (!user.isAdmin()) {
            throw new CustomException(403, "user is not an admin");
        }
        Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (movie == null) {
            throw new CustomException(400, "Invalid movie");
        }
        Quiz quiz = movie.getQuiz();
        movie.setQuiz(null);
        mongoTemplate.remove(quiz, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String, QuizResponse>> details(String movieId){
        Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
        Quiz quiz = movie.getQuiz();
        QuizResponse quizResponse = new QuizResponse(quiz);
        HashMap<String, QuizResponse> res = new HashMap<>();
        res.put("quiz", quizResponse);
        return new ResponseEntity<HashMap<String, QuizResponse>>(res, HttpStatus.valueOf(200));

    }
}