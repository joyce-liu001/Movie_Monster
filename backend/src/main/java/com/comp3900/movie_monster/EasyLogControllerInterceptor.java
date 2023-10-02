package com.comp3900.movie_monster;

import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.user.User;
import com.comp3900.movie_monster.user.UserResponse;
import com.comp3900.movie_monster.util.EnvConfig;
import com.comp3900.movie_monster.util.JwtUtil;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Component
public class EasyLogControllerInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    @Resource
    private MongoTemplate mongoTemplate;
    @Autowired
    public EasyLogControllerInterceptor(@Value("${spring.data.mongodb.uri}") String database_uri, JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }
    /**
     * 在controller调用之前执行
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
//        System.out.println(request.getRequestURI() + "开始执行");
        String token = request.getHeader("Authorization");
        if (!jwtUtil.checkToken(token)){
            throw new CustomException(401, "the token is invalid");
        }
        String uId = jwtUtil.getIdFromToken(token);
        User user =  mongoTemplate.findById(uId, User.class, "User");
        if (user == null) {
            throw new CustomException(401, "the token is invalid");
        }
        List<String> tokens = user.getTokens();
        if (!tokens.contains(token)) {
            throw new CustomException(401, "the token is invalid");
        }
        //查询数据库token是否  expirin
        return true;
    }

    /**
     * 在controller调用中执行
     */
    public void postHandle(
            HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
            throws Exception {
    }

    /**
     * 在controller调用后执行
     */
    public void afterCompletion(
            HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        System.out.println(request.getRequestURI() + "执行结束");
    }
}
