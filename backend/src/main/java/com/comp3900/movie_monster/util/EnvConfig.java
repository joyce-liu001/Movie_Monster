package com.comp3900.movie_monster.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
public class EnvConfig {

    @Value("${DATABASE_URI:mongodb://localhost:27017/3900project}")
    private String database_url;

    @Value("${frontend_url}")
    private String frontend_url;


    public String getFrontEndUrl() {
        return frontend_url;
    }

    public String getDatabaseUrl() {
        return database_url;
    }


}
