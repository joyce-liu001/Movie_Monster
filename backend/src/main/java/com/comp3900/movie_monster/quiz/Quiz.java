package com.comp3900.movie_monster.quiz;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
    @MongoId
    private String quizId;
    private String quizTitle;
    private String quizSynopsis;
    private String quizContent;
    private Date createTime = new Date();
}
