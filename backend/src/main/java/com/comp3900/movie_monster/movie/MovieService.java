package com.comp3900.movie_monster.movie;

import org.springframework.http.ResponseEntity;

import java.util.*;

public interface MovieService {
    String insertMovie(Movie movie);

    String removeMovie(Movie movie);

    Movie searchId(String id);

    ResponseEntity<HashMap<String, String>> addMovie(String token, String imdbId);

    ResponseEntity<MovieResponse> removeMovie(String token, String imdbId);

    ResponseEntity<MovieResponse> update(String token, String movieId, List<String> genraList, String fullTitle, String descreption);

    ResponseEntity<HashMap<String,MovieResponse>> details(String token, String movieId);

    ResponseEntity<HashMap<String,Object>> listMovie(String token, String keyword, String genre, String director, Integer start, String sort, Boolean ignoreWish, Boolean ignoreWatch, Boolean ignoreFavourite);

    ResponseEntity<HashMap<String,String>> random();
    ResponseEntity<HashMap<String, ArrayList>> searchSuggestion(String searchString);
    ResponseEntity<HashMap<String,String>> movieReview(String token, String movieId, Double rating, String reviewString);

    ResponseEntity<HashMap<String, Object>> movieRecommendation(String movieId, String isGenre, String isDirector);
}
