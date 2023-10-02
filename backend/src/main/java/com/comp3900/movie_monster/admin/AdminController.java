
package com.comp3900.movie_monster.admin;

import com.comp3900.movie_monster.movie.Movie;
import com.comp3900.movie_monster.movie.MovieResponse;
import com.comp3900.movie_monster.movie.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("admin")
@RestController
public class AdminController {

    private final MovieService movieService;

    @Autowired
    public AdminController(@Qualifier("movie") MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping(value = "movie/add")
    public ResponseEntity<HashMap<String, String>> addMovie(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String id = js.get("imdbId");
        return this.movieService.addMovie(token, id);
    }

    @PutMapping(value = "movie/update")
    public ResponseEntity<MovieResponse> updateMovie(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, Object> js) {
        String movieId = String.valueOf(js.get("movieId"));
        String description = String.valueOf(js.get("description"));
        String fullTitle = String.valueOf(js.get("fullTitle"));
        List<String> genreList = (List<String>) js.get("genreList");
        return this.movieService.update(token, movieId, genreList, fullTitle, description);
    }

    @PostMapping(value = "movie/delete")
    public ResponseEntity<MovieResponse> removeMovie(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String id = js.get("imdbId");
        return this.movieService.removeMovie(token, id);
    }

}
