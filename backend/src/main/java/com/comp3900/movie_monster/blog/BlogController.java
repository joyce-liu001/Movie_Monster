package com.comp3900.movie_monster.blog;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequestMapping("blog")
@RestController
public class BlogController {

    private final BlogService blogService;
    @Autowired
    public BlogController(@Qualifier("blog") BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping(value = "create")
    public ResponseEntity<HashMap<String,String>> blogCreate(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js){
        String title = js.get("title");
        String content = js.get("content");
        List<String> movieIdList = Collections.singletonList(js.get("movieIdList"));
        return this.blogService.createBlog(token, title, content, movieIdList);
    }

    @PutMapping(value = "edit")
    public ResponseEntity<HashMap<String,String>> blogEdit(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js){
        String blogId = js.get("blogId");
        String title = js.get("title");
        String content = js.get("content");
        List<String> movieIdList = Collections.singletonList(js.get("movieIdList"));
        return this.blogService.editBlog(token, blogId, title, content, movieIdList);
    }

    @DeleteMapping("remove")
    public ResponseEntity<HashMap<String,String>> blogRemove(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String blogId = js.get("blogId");
        return this.blogService.removeBlog(token, blogId);
    }


    @GetMapping("view")
    public ResponseEntity<HashMap<String, BlogResponse>> blogView(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String blogId = js.get("blogId");
        return this.blogService.viewBlog(token, blogId);
    }

    @GetMapping("list")
    public ResponseEntity<HashMap<String, Object>> blogList(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String uId = js.get("uId");
        return this.blogService.list(token, uId);
    }

    @GetMapping("listall")
    public ResponseEntity<HashMap<String,Object>> blogListall(@RequestHeader(name = "Authorization") String token) {
        return this.blogService.listall(token);
    }

}
