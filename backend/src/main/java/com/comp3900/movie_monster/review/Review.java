package com.comp3900.movie_monster.review;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
public class Review {
    @MongoId
    private String reviewId;
    private String reviewString;
    private String userId;
    private String movieId;
    private double rating;
    // key is UserId
    private List<String> thumbUp = new ArrayList<>();
    private List<String> thumbDown = new ArrayList<>();
    private Date date = new Date();
    private long timeSent = this.date.getTime();
}
