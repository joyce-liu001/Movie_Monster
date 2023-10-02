package com.comp3900.movie_monster.movie;

import com.comp3900.movie_monster.director.Director;
import com.comp3900.movie_monster.review.ReviewResponse;
import com.comp3900.movie_monster.user.ProfileResponse;
import com.comp3900.movie_monster.user.User;
import com.comp3900.movie_monster.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RequestMapping("movie")
@RestController
public class MovieController {
    private final MovieService movieService;
    @Autowired
    public MovieController(@Qualifier("movie") MovieService movieService) {
        this.movieService = movieService;
    }
    @GetMapping("list")
    public ResponseEntity<HashMap<String, Object>> movieList(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String keyword = js.get("keyword");
        String genre = js.get("genre");
        String director = js.get("director");
        Integer start = Integer.valueOf(js.get("start"));
        String sort = js.get("sortBy");
        Boolean ignoreWish = Boolean.valueOf(js.get("ignoreWish"));
        Boolean ignoreWatch = Boolean.valueOf(js.get("ignoreWatch"));
        Boolean ignoreFavourite = Boolean.valueOf(js.get("ignoreFavourite"));
        return movieService.listMovie(token, keyword, genre, director, start, sort, ignoreWish, ignoreWatch, ignoreFavourite);
    }

    @GetMapping("details")
    public ResponseEntity<HashMap<String,MovieResponse>> movieDetails(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String movieId = js.get("movieId");
        return movieService.details(token, movieId);
    }

    @GetMapping("random")
    public ResponseEntity<HashMap<String,String>> movieRandom(@RequestParam Map<String, String> js) {
        return movieService.random();
    }

    @GetMapping("search/suggestion")
    public ResponseEntity<HashMap<String, ArrayList>> searchSuggestion(@RequestParam Map<String, String> js) {
        String searchString = js.get("searchString");
        return movieService.searchSuggestion(searchString);
    }

    @PostMapping(value = "review")
    public ResponseEntity<HashMap<String,String>> movieReview (@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js){
        String reviewString = js.get("reviewString");
        String movieId = js.get("movieId");
        Double rating = Double.valueOf(js.get("rating"));
        return this.movieService.movieReview(token, movieId, rating, reviewString);
    }

    @GetMapping(value = "recommendations")
    public ResponseEntity<HashMap<String, Object>> movieRecommendation(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js){
        String movieId = js.get("movieId");
        String isGenre = js.get("isGenre");
        String isDirector = js.get("isDirector");
        return this.movieService.movieRecommendation(movieId, isGenre, isDirector);
    }
}