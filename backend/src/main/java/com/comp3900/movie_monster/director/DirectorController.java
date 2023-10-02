package com.comp3900.movie_monster.director;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DirectorController {

    private final DirectorService directorService;
    @Autowired
    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }
}
