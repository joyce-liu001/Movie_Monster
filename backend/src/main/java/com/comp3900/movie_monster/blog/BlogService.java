package com.comp3900.movie_monster.blog;

import com.comp3900.movie_monster.movie.MovieResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface BlogService {
    Blog searchId(String Id);
    ResponseEntity<HashMap<String,String>> createBlog(String token, String title, String content, List<String> movieIdList);

    ResponseEntity<HashMap<String,String>> editBlog(String token, String blogId, String title, String content, List<String> movieIdList);

    ResponseEntity<HashMap<String,String>> removeBlog(String token, String blogId);

    ResponseEntity<HashMap<String, BlogResponse>> viewBlog(String token, String blogId);

    ResponseEntity<HashMap<String, Object>> list(String token, String uId);
    ResponseEntity<HashMap<String, Object>> listall(String token);
}
