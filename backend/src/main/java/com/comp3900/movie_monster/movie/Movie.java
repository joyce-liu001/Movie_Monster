package com.comp3900.movie_monster.movie;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comp3900.movie_monster.actor.Actor;
import com.comp3900.movie_monster.director.Director;
import com.comp3900.movie_monster.quiz.Quiz;
import com.comp3900.movie_monster.review.Review;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Data
@Accessors(chain = true)
public class Movie {
    @MongoId
    private String movieId;
    private String fullTitle;
    private String description;

    private double rating = 0;
    private String image;
    private String releaseDate;
    private double imdbRating;
    private String directors;
    private List<Director> directorList = new ArrayList<>();
    private List<Actor> actorList = new ArrayList<>();
    private String genres;
    private String contentRating;
    private List<String> genreList = new ArrayList<>();
    private List<Review> reviews = new ArrayList<>();

    private Quiz quiz = null;

    public Movie() {}
    public Movie(JSONObject jsonObject) {
        this.movieId = jsonObject.getString("id");
        this.fullTitle = jsonObject.getString("title");
        this.description = jsonObject.getString("plot");
        this.image = jsonObject.getString("image");
        this.releaseDate = jsonObject.getString("releaseDate");
        this.imdbRating = Double.parseDouble(jsonObject.getString("imDbRating"));
        this.directors = jsonObject.getString("directors");
        this.genres = jsonObject.getString("genres");
        this.contentRating = jsonObject.getString("contentRating");
        JSONArray directorArray = jsonObject.getJSONArray("directorList");
        for (int i = 0; i < directorArray.size(); i++){
            JSONObject directorJSONObject = directorArray.getJSONObject(i);
            Director director = new Director();
            director.setId(directorJSONObject.getString("id"));
            director.setName(directorJSONObject.getString("name"));
            this.directorList.add(director);
        }
        JSONArray actorArray = jsonObject.getJSONArray("actorList");
        for (int i = 0; i < actorArray.size(); i++){
            JSONObject actorJSONObject = actorArray.getJSONObject(i);
            Actor actor = new Actor();
            actor.setId(actorJSONObject.getString("id"));
            actor.setImage(actorJSONObject.getString("image"));
            actor.setAsCharacter(actorJSONObject.getString("asCharacter"));
            this.actorList.add(actor);
        }
        String genreString = jsonObject.getString("genres");
        String list[] = genreString.split(", ");
        for (int i = 0; i < list.length; i++){
            this.genreList.add(list[i]);
        }
    }

    public void updateReview(Review review){
        String reviewId = review.getReviewId();
        for (int i = 0; i < reviews.size(); i++){
            if (reviews.get(i).getReviewId().equals(reviewId)){
                reviews.remove(i);
                break;
            }
        }
        this.reviews.add(review);
    }

    public void removeReview(Review review){
        String reviewId = review.getReviewId();
        for (int i = 0; i < reviews.size(); i++){
            if (reviews.get(i).getReviewId().equals(reviewId)){
                reviews.remove(i);
                break;
            }
        }
    }

    public boolean containsQuiz(){
        return quiz != null;
    }
}
