package com.comp3900.movie_monster.movie;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class MoviesResponse {
    @JsonProperty("movieId")
    private String movieId;
    private String fullTitle;
    private String image;
    private Double rating;
    public MoviesResponse(Movie movie) {
        this.fullTitle = movie.getFullTitle();
        this.image = movie.getImage();
        this.rating = movie.getRating();
        this.movieId = movie.getMovieId();
    }
}
