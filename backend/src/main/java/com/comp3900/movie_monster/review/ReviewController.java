package com.comp3900.movie_monster.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("review")
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(@Qualifier("review") ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PutMapping(value = "edit")
    public ResponseEntity<ReviewResponse> editReview(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String reviewId = String.valueOf(js.get("reviewId"));
        double rating = Double.parseDouble((String) js.get("rating"));
        String reviewString = String.valueOf(js.get("reviewString"));
        return this.reviewService.editReview(token,reviewId,rating,reviewString);
    }

    @DeleteMapping(value = "remove")
    public ResponseEntity<ReviewResponse> removeReview(@RequestHeader(name = "Authorization") String token, @RequestParam(name = "reviewId") String reviewId){
        return this.reviewService.removeReview(token,reviewId);
    }
    @PostMapping(value = "thumbsup")
    public ResponseEntity<ReviewResponse> thumbsUp (@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js){
        String reviewId = String.valueOf(js.get("reviewId"));
        return this.reviewService.thumbsUp(token, reviewId);
    }

    @PostMapping(value = "thumbsdown")
    public ResponseEntity<ReviewResponse> thumbsDown (@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js){
        String reviewId = String.valueOf(js.get("reviewId"));
        return this.reviewService.thumbsDown(token, reviewId);
    }
}
