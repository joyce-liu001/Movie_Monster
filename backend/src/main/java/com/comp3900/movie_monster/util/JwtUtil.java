package com.comp3900.movie_monster.util;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.user.User;

import com.auth0.jwt.JWT;
import com.mongodb.client.MongoClients;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;


import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtUtil {
    private final String TOKEN_SECRET = "privateKey";
    @Resource
    private MongoTemplate mongoTemplate = new MongoTemplate(MongoClients.create("mongodb://localhost:27017"), "3900project");
    public String generateToken(User user){
        //heander  token(check inferface), chaxuin
        //springsecurity  + oauth2.0  四种模式()    user_id  token   id   exprin    aes
        //oauth2.0  smal  cas oidc协议
        //shrio

        //
        // 1.login   username password;    ====>token   token  redis->mongodb->mysql
        // username password
        Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
        Map<String, Object> header = new HashMap<>(2);
        header.put("Type", "JWT");
        header.put("alg","HS256");
        return JWT.create()
                .withHeader(header)
                .withClaim("uId", user.getUserId())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .sign(algorithm);
    }

    public String getIdFromToken(String token) {
        if (checkToken(token)) {
            return JWT.require(Algorithm.HMAC256(TOKEN_SECRET)).
                    build().verify(token).getClaim("uId").asString();
        }
        return "";
    }

    public boolean checkToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(TOKEN_SECRET)).build().verify(token);
        } catch (JWTVerificationException e) {
            throw new CustomException(401, "the token is invalid");
        }
        return true;
    }

    public String generateShortToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
        Map<String, Object> header = new HashMap<>(2);
        header.put("Type", "JWT");
        header.put("alg","HS256");
        return JWT.create()
                .withHeader(header)
                .withClaim("uId", user.getUserId())
                .withExpiresAt(new Date(System.currentTimeMillis() + 10*60*60))
                .sign(algorithm);
    }
}
