package com.comp3900.movie_monster.movie;

import com.comp3900.movie_monster.actor.Actor;
import com.comp3900.movie_monster.director.Director;
import com.comp3900.movie_monster.review.Review;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("Lombok")
@Data
@AllArgsConstructor
public class MovieResponse {
    @JsonProperty("movieId")
    private String movieId;
    private String fullTitle;
    private String image;
    private Double rating;
    private String description;
    private String releaseDate;
    private Double imdbRating;
    private String contentRating;
    private List<Director> directorList;
    private List<Actor> actorList;
    private List<String> genreList;
    private List<ReviewResponse> reviews;
    private boolean isWatched = false;
    private boolean isWish = false;
    private boolean isFavourite = false;
    private boolean hasReviewed = false;
    public MovieResponse(Movie movie) {
        this.fullTitle = movie.getFullTitle();
        this.image = movie.getImage();
        this.rating = movie.getRating();
        this.movieId = movie.getMovieId();
        this.contentRating = movie.getContentRating();
        this.description = movie.getDescription();
        this.releaseDate = movie.getReleaseDate();
        this.imdbRating = movie.getImdbRating();
        this.directorList = movie.getDirectorList();
        this.actorList = movie.getActorList();
        this.genreList = movie.getGenreList();
    }
}
