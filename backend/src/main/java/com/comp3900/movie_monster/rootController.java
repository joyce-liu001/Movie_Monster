package com.comp3900.movie_monster;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class rootController {

    private Date curDate = new Date(System.currentTimeMillis());

    @GetMapping(value = "/")
    public ResponseEntity<Map<String, String>> checkDeploy() {
        Map<String, String> re = new HashMap<>();
        re.put("message", "Movie Monster Backend");
        re.put("deployed-date", this.curDate.toString());
        return new ResponseEntity<>(re, HttpStatus.valueOf(200));
    }

}
