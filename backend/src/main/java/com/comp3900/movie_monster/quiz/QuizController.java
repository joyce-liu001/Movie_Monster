package com.comp3900.movie_monster.quiz;

import com.comp3900.movie_monster.movie.MovieResponse;
import com.comp3900.movie_monster.review.ReviewResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("quiz")
@RestController
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping(value = "create")
    public ResponseEntity<ReviewResponse> createQuiz(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String title = js.get("quizTitle");
        String quizSynopsis = js.get("quizSynopsis");
        String quizContent = js.get("quizContent");
        String movieId = js.get("movieId");
        return this.quizService.createQuiz(token, title, quizSynopsis, quizContent, movieId);
    }

    @PutMapping(value = "edit")
    public ResponseEntity<ReviewResponse> editQuiz(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String quizSynopsis = js.get("quizSynopsis");
        String quizContent = js.get("quizContent");
        String movieId = js.get("movieId");
        return this.quizService.editQuiz(token, quizSynopsis, quizContent, movieId);
    }

    @DeleteMapping(value = "remove")
    public ResponseEntity<ReviewResponse> removeQuiz(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String movieId = js.get("movieId");
        return this.quizService.removeQuiz(token, movieId);
    }

    @GetMapping("details")
    public ResponseEntity<HashMap<String, QuizResponse>> quizDetails(@RequestParam(value = "movieId") String movieId) {
        ResponseEntity<HashMap<String, QuizResponse>> res = quizService.details(movieId);
        System.out.println(res);
        return res;
    }
}
