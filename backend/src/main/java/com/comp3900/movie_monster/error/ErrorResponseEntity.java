package com.comp3900.movie_monster.error;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponseEntity {

    private int code;
    private String message;

}
