package com.comp3900.movie_monster.actor;


import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.logging.Logger;

@Repository("actor")
@Service
public class ActorAccessService implements ActorService{
    private static final String COLLECTION_NAME = "Actor";

    @Resource
    private MongoTemplate mongoTemplate;
    @Override
    public void insertActor(Actor actor){
        mongoTemplate.insert(actor, COLLECTION_NAME);
    }


    public ActorAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }
}
