package com.comp3900.movie_monster.movie;


import com.alibaba.fastjson.JSONObject;
import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.review.Review;
import com.comp3900.movie_monster.user.User;
import com.comp3900.movie_monster.director.Director;
import com.comp3900.movie_monster.util.JwtUtil;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.stream.Collectors;


@Repository("movie")
@Service

public class MovieAccessService implements MovieService {
    private static final String COLLECTION_NAME = "Movie";
    private static final JwtUtil jwtUtil = new JwtUtil();
    @Resource
    private MongoTemplate mongoTemplate;

    public MovieAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    @Override
    public String insertMovie(Movie movie) {
        mongoTemplate.save(movie, COLLECTION_NAME);
        return movie.getMovieId();
    }

    @Override
    public String removeMovie(Movie movie) {
        mongoTemplate.remove(movie,COLLECTION_NAME);
        return movie.getMovieId();
    }

    @Override
    public Movie searchId(String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, COLLECTION_NAME);
        return mv;
    }

    @Override
    public ResponseEntity<HashMap<String, String>> addMovie(String token, String imdbId) {
        // check user
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        if (!user.isAdmin()) {
            throw new CustomException(403, "auth user is not an admin");
        }

        // find movie by imdbId from url
        String url = "https://imdb-api.com/en/API/Title/k_nvvm38e4/" + imdbId;
        String json = loadJson(url);
        JSONObject jsonObject = JSONObject.parseObject(json);
        if (jsonObject.getString("id") == null) {
            throw new CustomException(400, "imdbId is invalid");
        }
        Movie newMv = new Movie(jsonObject);
        String mvId = newMv.getMovieId();
        if (searchId(mvId) != null) {
            //the movie already exists
            throw new CustomException(400, "the movie already exists");
        }
        insertMovie(newMv);
        HashMap<String, String> res = new HashMap<>();
        res.put("movieId", newMv.getMovieId());
        return new ResponseEntity<HashMap<String, String>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<MovieResponse> removeMovie(String token, String movieId) {
        // check user
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        if (!user.isAdmin()) {
            throw new CustomException(403, "auth user is not an admin");
        }
        Movie movie = searchId(movieId);
        mongoTemplate.remove(movie, COLLECTION_NAME);
        return new ResponseEntity<MovieResponse>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<MovieResponse> update(String token, String movieId, List<String> genraList, String fullTitle, String descreption) {
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "the token invalid");
        }
        if (!user.isAdmin()) {
            throw new CustomException(403, "auth user is not an admin");
        }
        Movie movie = searchId(movieId);
        if (movie == null) {
            // the movieId is invalid
            throw new CustomException(400, "the movie invalid");
        }
        // update (save) movie
        movie.setGenreList(genraList);
        movie.setFullTitle(fullTitle);
        movie.setDescription(descreption);
        movie.setGenres(String.join(",", genraList));
        insertMovie(movie);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, MovieResponse>> details(String token, String movieId) {
        Movie mv = searchId(movieId);
        if (mv == null) {
            // the movieId is invalid
            throw new CustomException(400, "the movieId invalid");
        }
        HashMap<String, MovieResponse> res = new HashMap<>();
        MovieResponse movieResponse = new MovieResponse(mv);
        List<ReviewResponse> reviewResponsesList = new ArrayList<>();
        switch (token) {
            case "":
                // Anonymous
                for (Review review : mv.getReviews()) {
                    ReviewResponse reviewResponse = new ReviewResponse(review);
                    User writer = mongoTemplate.findById(review.getUserId(), User.class, "User");
                    reviewResponse.setReviewerUsername(writer.getUsername());
                    // add into list
                    reviewResponsesList.add(reviewResponse);
                }
                movieResponse.setReviews(reviewResponsesList);
                res.put("movie", movieResponse);
                return new ResponseEntity<HashMap<String, MovieResponse>>(res, HttpStatus.valueOf(200));
            default:
                User user = getUserByToken(token);
                if (user == null) {
                    throw new CustomException(401, "the token invalid");
                }
                if (user.getWatchedList().contains(mv)) {
                    movieResponse.setWatched(true);
                }
                if (user.getFavouriteList().contains(mv)) {
                    movieResponse.setFavourite(true);
                }
                if (user.getWishList().contains(mv)) {
                    movieResponse.setWish(true);
                }
                // check has review
                if (mv.getReviews().stream().anyMatch(review -> Objects.equals(review.getUserId(),
                        user.getUserId()))) {
                    movieResponse.setHasReviewed(true);
                }
                // set review response
                List<Review> movie_ratinglist = new ArrayList<>();
                for (Review review : mv.getReviews()) {
                    if (user.getBlockedUsers().contains(review.getUserId())) {
                        // user do not see the block user reviews
                        continue;
                    }
                    ReviewResponse reviewResponse = new ReviewResponse(review);
                    if (review.getThumbDown().contains(user.getUserId())) {
                        reviewResponse.setIsThisUserThumbsDown(true);
                    } else if (review.getThumbUp().contains(user.getUserId())) {
                        reviewResponse.setIsThisUserThumbsUp(true);
                    }
                    User writer = mongoTemplate.findById(review.getUserId(), User.class, "User");
                    reviewResponse.setReviewerUsername(writer.getUsername());
                    // add into list
                    reviewResponsesList.add(reviewResponse);
                    movie_ratinglist.add(review);
                }
                // sort review by time
                List<ReviewResponse> reviewListResult = reviewResponsesList.stream()
                        .sorted(Comparator.comparing(ReviewResponse::getTimeSent))
                        .collect(Collectors.toList());

                movieResponse.setReviews(reviewListResult);
                // calculate rating for no block user rating
                movieResponse.setRating(this.calculateRating(movie_ratinglist));
                // check has review
                if (mv.getReviews().stream().anyMatch(review -> Objects.equals(review.getUserId(),
                        user.getUserId()))) {
                    movieResponse.setHasReviewed(true);
                }
                res.put("movie", movieResponse);
                return new ResponseEntity<HashMap<String, MovieResponse>>(res, HttpStatus.valueOf(200));
        }
    }

    @Override
    public ResponseEntity<HashMap<String, Object>> listMovie(String token, String keyword, String genre, String director, Integer start, String sort, Boolean ignoreWish, Boolean ignoreWatch, Boolean ignoreFavourite) {
        int index = 0;
        int end;
        if (start == 0) {
            end = start + 29;
        } else {
            end = start + 9;
        }

        HashMap<String, Object> res = new HashMap<>();
        // find all movie match the criteria
        Criteria criteria = new Criteria();
        criteria.andOperator(Criteria.where("directors").regex("(?i).*?" + director + ".*"),
                Criteria.where("genres").regex("(?i).*?" + genre + ".*"),
                criteria.orOperator(Criteria.where("fullTitle").regex("(?i).*?" + keyword + ".*"), Criteria.where("description").regex(".*?" + keyword + ".*")));
        Query query = new Query(criteria);
        List<Movie> mappresults = mongoTemplate.find(query, Movie.class, COLLECTION_NAME);

        // ignore user's list
        if (token != "") {
            // ["wish", "watched", "favourite"]
            User user = getUserByToken(token);
            List<Movie> ignoreMovies = new ArrayList<>();
            if (ignoreWish) {
                ignoreMovies.addAll(user.getWishList());
            }
            if (ignoreWatch) {
                ignoreMovies.addAll(user.getWatchedList());
            }
            if (ignoreFavourite) {
                ignoreMovies.addAll(user.getFavouriteList());
            }
            mappresults.removeAll(ignoreMovies);

            // re calculate rating if user has block other
            for (Movie mv : mappresults) {
                List<Review> movie_ratinglist = new ArrayList<>();
                for (Review review: mv.getReviews()) {
                    if (user.getBlockedUsers().contains(review.getUserId())) {
                        // user do not see the block user reviews
                        continue;
                    }
                    movie_ratinglist.add(review);
                }
                mv.setRating(this.calculateRating(movie_ratinglist));
            }
        }

        // sort the list
        List<Movie> sortMovies = null;
        if (sort.equals("name")) {
            sortMovies = mappresults.stream()
                    .sorted(Comparator.comparing(Movie::getFullTitle))
                    .collect(Collectors.toList());
        } else if (sort.equals("rating")) {
            // sort by rating
            sortMovies = mappresults.stream()
                    .sorted(Comparator.comparingDouble(Movie::getRating).reversed())
                    .collect(Collectors.toList());
        }

        // return only 10 movies from start to end
        List<MoviesResponse> result = new ArrayList<>();
        for (Movie movie : sortMovies) {
            // check end
            index++;
            if (index >= start && index <= end) {
                result.add(new MoviesResponse(movie));
            } else if (index > end) {
                res.put("movies", result);
                res.put("end", end);
                return new ResponseEntity<HashMap<String, Object>>(res, HttpStatus.valueOf(200));
            }
        }
        end = -1;
        res.put("movies", result);
        res.put("end", end);
        return new ResponseEntity<HashMap<String, Object>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, String>> random() {
        List<Movie> allmovies = mongoTemplate.findAll(Movie.class, COLLECTION_NAME);
        Random rand = new Random();
        int randomIndex = rand.nextInt(allmovies.size());
        Movie randomMovie = allmovies.get(randomIndex);
        HashMap<String, String> res = new HashMap<>();
        res.put("movieId", randomMovie.getMovieId());
        // return the id of movies
        return new ResponseEntity<HashMap<String, String>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, ArrayList>> searchSuggestion(String searchString) {
        // Search for movies where either the title matches the search string and
        // find all movie match the criteria
        Criteria criteria = new Criteria();
        criteria.andOperator(Criteria.where("fullTitle").regex("(?i).*?" + searchString + ".*"));
        Query query = new Query(criteria);
        List<Movie> movies = mongoTemplate.find(query, Movie.class, COLLECTION_NAME);
        // return an array of string titles.
        ArrayList listTitles = (ArrayList) movies.stream().limit(10).map(m -> m.getFullTitle()).collect(Collectors.toList());
        HashMap<String, ArrayList> res = new HashMap<>();
        res.put("titles", listTitles);
        return new ResponseEntity<HashMap<String, ArrayList>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, String>> movieReview(String token, String movieId, Double rating, String reviewString) {
        // Add a review to the given movie.
        if (rating < 0 || rating > 5) {
            throw new CustomException(400, "rating must be between 0 and 5");
        }
        // get user
        User user = getUserByToken(token);
        // check movieId
        Movie movie = this.searchId(movieId);
        if (movie == null) {
            // the movieId is invalid
            throw new CustomException(400, "the movieId invalid");
        }
        // create review
        Review newReview = new Review();
        newReview.setReviewId(UUID.randomUUID().toString());
        newReview.setReviewString(reviewString);
        newReview.setMovieId(movieId);
        newReview.setUserId(user.getUserId());
        newReview.setRating(rating);

        // reset the movie
        List<Review> reviewList = movie.getReviews();
        reviewList.add(newReview);
        movie.setRating(calculateRating(reviewList));
        movie.setReviews(reviewList);
        // insert in database
        this.insertMovie(movie);
        mongoTemplate.save(newReview, "Review");
        HashMap<String, String> res = new HashMap<>();
        res.put("reviewId", newReview.getReviewId());
        return new ResponseEntity<HashMap<String, String>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, Object>> movieRecommendation(String movieId, String isGenre, String isDirector) {

        Movie movie = this.searchId(movieId);
        List<Director> directors = movie.getDirectorList();
        List<String> genres = movie.getGenreList();
        Criteria criteria = new Criteria();
        criteria.andOperator(Criteria.where("directors").regex("(?i).*?" + "" + ".*"));
        Query query = new Query(criteria);
        List<Movie> resultMovie = new ArrayList<>();
        List<Movie> movies = mongoTemplate.find(query, Movie.class, COLLECTION_NAME);

        for (Movie selectMovie : movies) {
            if (isGenre.equals("true") && isDirector.equals("false") && judgeGenre(genres, selectMovie.getGenreList())) {
                resultMovie.add(selectMovie);
            } else if (isDirector.equals("true") && isGenre.equals("false") && judgeDirector(directors, selectMovie.getDirectorList())) {
                resultMovie.add(selectMovie);
            } else if (isDirector.equals("false") && isGenre.equals("false") && (judgeGenre(genres, selectMovie.getGenreList()) || judgeDirector(directors, selectMovie.getDirectorList()))) {
                resultMovie.add(selectMovie);
            } else if (isDirector.equals("true") && isGenre.equals("true") && judgeGenre(genres, selectMovie.getGenreList()) && judgeDirector(directors, selectMovie.getDirectorList())) {
                resultMovie.add(selectMovie);
            }
        }


        List<MoviesResponse> result = new ArrayList<>();
        for (Movie mv : resultMovie) {
            if (!mv.getMovieId().equals(movie.getMovieId())) {
                result.add(new MoviesResponse(mv));
            }
        }
        HashMap<String, Object> res = new HashMap<>();
        res.put("movies", result);

        return new ResponseEntity<HashMap<String, Object>>(res, HttpStatus.valueOf(200));
    }
    public static boolean judgeDirector(List<Director> list1, List<Director> list2){
        boolean flag = false;
        List<Director> origin = new ArrayList<>();
        origin.addAll(list1);
        origin.retainAll(list2);
        if(origin.size()>0){
            flag = true;
        }
        return flag;
    }

    public static boolean judgeGenre(List<String> list1, List<String> list2){
        boolean flag = false;
        List<String> origin = new ArrayList<>();
        origin.addAll(list1);
        origin.retainAll(list2);
        if(origin.size()>0){
            flag = true;
        }
        return flag;
    }
    public static String loadJson(String url) {
        StringBuilder json = new StringBuilder();
        try {
            URL urlObject = new URL(url);
            URLConnection uc = urlObject.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(uc.getInputStream()));
            String inputLine = null;
            while ((inputLine = in.readLine()) != null) {
                json.append(inputLine);
            }
            in.close();
        } catch (MalformedURLException e) {
            throw new CustomException(400, "the imdbId is invalid");
        } catch (IOException e) {
            throw new CustomException(400, "the imdbId is invalid");
        }
        return json.toString();
    }

    public User getUserByToken(String token) {
        String uid = jwtUtil.getIdFromToken(token);
        User user = null;
        user = mongoTemplate.findById(uid, User.class, "User");
        return user;
    }

    public double calculateRating(List<Review> reviewList) {
        if(reviewList.size() == 0) {
            return 0.0;
        }
        Double aveRating = reviewList.stream()
            .mapToDouble(Review::getRating)
            .average()
            .orElseThrow(NoSuchElementException::new);
        return aveRating;
    }
}
