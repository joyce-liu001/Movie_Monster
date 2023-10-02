package com.comp3900.movie_monster.review;

import com.comp3900.movie_monster.notification.Notification;
import org.springframework.beans.factory.annotation.Value;
import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.movie.Movie;
import com.comp3900.movie_monster.user.User;
import com.mongodb.client.MongoClients;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import com.comp3900.movie_monster.util.JwtUtil;
import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Repository("review")
@Service
public class ReviewAccessService implements ReviewService{
    private static final String COLLECTION_NAME = "Review";
    @Resource
    private MongoTemplate mongoTemplate;
    private final JwtUtil jwtUtil = new JwtUtil();
    @Override
    public void insertReview(Review review){
        mongoTemplate.save(review, COLLECTION_NAME);
    }
    @Override
    public void deleteReview(Review review){
        mongoTemplate.remove(review, COLLECTION_NAME);
    }
    @Override
    public Review searchId(String reviewId) {
        Review rv = null;
        rv = mongoTemplate.findById(reviewId, Review.class, COLLECTION_NAME);
        return rv;
    }

    public ReviewAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    @Override
    public String insertMovie(Movie movie) {
        mongoTemplate.save(movie, "Movie");
        return movie.getMovieId();
    }
    @Override
    public Movie searchMovieId(String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        return mv;
    }
    public User getUserByToken(String token) {
        String uid = jwtUtil.getIdFromToken(token);
        User user = null;
        user = mongoTemplate.findById(uid, User.class, "User");
        return user;
    }
    @Override
    public ResponseEntity<ReviewResponse> editReview(String token, String reviewId, double rating, String reviewString){
        if (rating < 0 || rating > 5){
            throw new CustomException(400, "rating must be between 0 and 5");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        Review review =  searchId(reviewId);
        if (review == null){
            throw new CustomException(400, "the reviewId is invalid");
        }
        if (!review.getUserId().equals(user.getUserId()) && !user.isAdmin()){
            throw new CustomException(403, "auth user is not an admin");
        }
        Movie movie = mongoTemplate.findById(review.getMovieId(), Movie.class, "Movie");
        int length = movie.getReviews().size();

        review.setRating(rating);
        review.setReviewString(reviewString);
        Date date = new Date();
        review.setTimeSent(date.getTime());
        insertReview(review);
        movie.updateReview(review);
        // update rating
        List<Review> reviewList = movie.getReviews();
        Double aveRating = reviewList.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElseThrow(NoSuchElementException::new);
        movie.setRating(aveRating);
        insertMovie(movie);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<ReviewResponse> thumbsUp(String token, String reviewId){
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        Review review =  searchId(reviewId);
        if (review == null){
            throw new CustomException(400, "the reviewId is invalid");
        }
        String userId = user.getUserId();
        List<String> thumbsUpList = review.getThumbUp();
        List<String> thumbsDownList = review.getThumbDown();
        boolean ret = thumbsUpList.remove(userId);
        if (!ret){
            thumbsUpList.add(userId);
        }
        System.out.println(thumbsUpList);
        thumbsDownList.remove(userId);
        review.setThumbUp(thumbsUpList);
        review.setThumbDown(thumbsDownList);
        insertReview(review);
        Movie movie = mongoTemplate.findById(review.getMovieId(), Movie.class, "Movie");
        movie.updateReview(review);
        insertMovie(movie);

        // send notification to writer
        User toUser = mongoTemplate.findById(review.getUserId(), User.class, "User");
        Notification notification = new Notification("THUMBS", userId, toUser.getUserId());
        notification.setReviewId(reviewId);
        notification.setMovieId(movie.getMovieId());
        // send notification.
        List<Notification> listnotif = toUser.getNotificationList();
        listnotif.add(0, notification);
        toUser.setNotificationList(listnotif);
        mongoTemplate.save(toUser, "User");
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<ReviewResponse> thumbsDown(String token, String reviewId){
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        Review review =  searchId(reviewId);
        if (review == null){
            throw new CustomException(400, "the reviewId is invalid");
        }
        String userId = user.getUserId();
        List<String> thumbsUpList = review.getThumbUp();
        List<String> thumbsDownList = review.getThumbDown();
        boolean ret = thumbsDownList.remove(userId);
        if (!ret){
            thumbsDownList.add(userId);
        }
        thumbsUpList.remove(userId);
        review.setThumbUp(thumbsUpList);
        review.setThumbDown(thumbsDownList);
        insertReview(review);
        Movie movie = searchMovieId(review.getMovieId());
        movie.updateReview(review);
        insertMovie(movie);

        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<ReviewResponse> removeReview(String token, String reviewId){
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        Review review =  searchId(reviewId);
        if (review == null){
            throw new CustomException(400, "the reviewId is invalid");
        }
        if (!review.getUserId().equals(user.getUserId()) && !user.isAdmin()){
            throw new CustomException(403, "auth user is not an admin");
        }
        Movie movie = mongoTemplate.findById(review.getMovieId(), Movie.class, "Movie");
        // update rating
        List<Review> reviewList = movie.getReviews();
        reviewList.remove(review);
        Double aveRating = reviewList.isEmpty() ? 0 : reviewList.stream()
            .mapToDouble(Review::getRating)
            .average()
            .orElseThrow(NoSuchElementException::new);
        movie.setRating(aveRating);
        movie.setReviews(reviewList);
        insertMovie(movie);
        deleteReview(review);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

}
