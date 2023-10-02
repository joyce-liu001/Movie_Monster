package com.comp3900.movie_monster.director;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.HashSet;

@Data
public class Director {
    @MongoId
    private String id;
    private String name;
}
