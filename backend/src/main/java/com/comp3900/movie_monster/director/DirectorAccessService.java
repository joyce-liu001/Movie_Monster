package com.comp3900.movie_monster.director;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comp3900.movie_monster.actor.Actor;
import com.comp3900.movie_monster.movie.Movie;
import com.comp3900.movie_monster.util.EnvConfig;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Repository("director")
@Service
public class DirectorAccessService implements DirectorService{
    private static final String COLLECTION_NAME = "Director";
    private static Object dir;
    @Resource
    private MongoTemplate mongoTemplate;

    @Autowired
    private EnvConfig envConfig;
    @Override
    public void insertDirector(Director director){
        mongoTemplate.insert(director, COLLECTION_NAME);
    }

    public DirectorAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    public static void main(String[] args) {
        EnvConfig envConfig = new EnvConfig();
        MongoTemplate mongoTemplate = new MongoTemplate(MongoClients.create("mongodb://localhost:27017"), "3900project");
        List<JSONObject> documentList = mongoTemplate.findAll(JSONObject.class, "test");
        for (JSONObject jsonObject: documentList) {
            Movie movie = new Movie();
            movie.setMovieId(jsonObject.getString("id"));
            movie.setFullTitle(jsonObject.getString("title"));
            movie.setDescription(jsonObject.getString("plot"));
            movie.setRating(0);
            movie.setImdbRating(Double.parseDouble(jsonObject.getString("imDbRating")));
            movie.setImage(jsonObject.getString("image"));
            movie.setReleaseDate(jsonObject.getString("releaseDate"));
            movie.setDirectors(jsonObject.getString("directors"));
            movie.setGenres(jsonObject.getString("genres"));
            movie.setContentRating(jsonObject.getString("contentRating"));

            JSONArray directorArray = jsonObject.getJSONArray("directorList");
            List<Director> directorList = new ArrayList<>();
            for (int i = 0; i < directorArray.size(); i++) {
                JSONObject directorJSONObject = directorArray.getJSONObject(i);
                Director director = new Director();
                director.setId(directorJSONObject.getString("id"));
                director.setName(directorJSONObject.getString("name"));
                directorList.add(director);
                mongoTemplate.save(director, "Director");
            }
            movie.setDirectorList(directorList);
            JSONArray actorArray = jsonObject.getJSONArray("actorList");
            List<Actor> actorList = new ArrayList<>();
            for (int i = 0; i < actorArray.size(); i++) {
                JSONObject actorJSONObject = actorArray.getJSONObject(i);
                Actor actor = new Actor();
                actor.setName(actorJSONObject.getString("name"));
                actor.setId(actorJSONObject.getString("id"));
                actor.setImage(actorJSONObject.getString("image"));
                actor.setAsCharacter(actorJSONObject.getString("asCharacter"));
                actorList.add(actor);
                mongoTemplate.save(actor, "Actor");
            }
            movie.setActorList(actorList);
            String genreString = jsonObject.getString("genres");
            String list[] = genreString.split(", ");
            List<String> genreList = new ArrayList<>();
            for (int i = 0; i < list.length; i++) {
                genreList.add(list[i]);
            }
            movie.setGenreList(genreList);
            mongoTemplate.save(movie, "Movie");
        }
    }
}


