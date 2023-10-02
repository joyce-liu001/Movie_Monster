package com.comp3900.movie_monster.quiz;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
@Data
@AllArgsConstructor
@Document
@NoArgsConstructor

public class QuizResponse {
    @JsonProperty("quizId")
    private String quizId;
    private String quizTitle;
    private String quizSynopsis;
    private String quizContent;
    private Date createTime;

    public QuizResponse(Quiz quiz) {
        this.quizId = quiz.getQuizId();
        this.quizTitle = quiz.getQuizTitle();
        this.quizSynopsis = quiz.getQuizSynopsis();
        this.quizContent = quiz.getQuizContent();
        this.createTime = quiz.getCreateTime();
    }
}
