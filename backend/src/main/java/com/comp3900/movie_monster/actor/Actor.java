package com.comp3900.movie_monster.actor;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.HashSet;

@Data
public class Actor {
    @MongoId
    private String id;
    private String image;
    private String name;
    private String asCharacter;
}
