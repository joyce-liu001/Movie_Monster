package com.comp3900.movie_monster.blog;

import com.comp3900.movie_monster.notification.Notification;
import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.user.User;
import com.comp3900.movie_monster.util.JwtUtil;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Repository("blog")
@Service
public class BlogAccessService implements BlogService{
    private static final String COLLECTION_NAME = "Blog";
    private static final JwtUtil jwtUtil = new JwtUtil();
    @Resource
    private MongoTemplate mongoTemplate;

    public BlogAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    @Override
    public Blog searchId(String Id) {
        Blog blog = null;
        blog = mongoTemplate.findById(Id, Blog.class, COLLECTION_NAME);
        return blog;
    }

    public String insertBlog(Blog blog) {
        mongoTemplate.save(blog, COLLECTION_NAME);
        return blog.getBlogId();
    }

    public void saveUser(User user) {
        mongoTemplate.save(user, "User");
    }


    @Override
    public ResponseEntity<HashMap<String,String>> createBlog(String token, String title, String content, List<String> movieIdList) {
        // check token is valid
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        // check Title is empty and content is empty
        if (title.equals("")) {
            throw new CustomException(400, "Title is empty");
        }
        if (content.equals("")) {
            throw new CustomException(400, "content is empty");
        }
        // create a blog.
        Blog newblog = new Blog(title, content, movieIdList, user);
        List<Blog> blogList = user.getBlogList();
        blogList.add(newblog);
        user.setBlogList(blogList);
        insertBlog(newblog);
        saveUser(user);
        // Friends of the user are notified.
        setNotification(user, newblog.getBlogId());
        HashMap<String, String> res = new HashMap<>();
        res.put("blogId", newblog.getBlogId());
        return new ResponseEntity<HashMap<String,String>>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String,String>> editBlog(String token, String blogId, String title, String content, List<String> movieIdList){
        // check token is valid
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        // check Title is empty and content is empty
        if (title.equals("")) {
            throw new CustomException(400, "Title is empty");
        }
        if (content.equals("")) {
            throw new CustomException(400, "content is empty");
        }
        // find blog.
        Blog blog = searchId(blogId);
        if (blog == null) {
            throw new CustomException(400, "blogId does not refer to a valid blog");
        }
        if (! user.getBlogList().contains(blog)) {
            throw new CustomException(400, "user are not blog author");
        }
        List<Blog> blogList = user.getBlogList();
        // edit
        blogList.remove(blog);
        blog.setContent(content);
        blog.setTitle(title);
        blog.setMovieIdList(movieIdList);
        Date date = new Date();
        blog.setTimeCreated(date.getTime());
        blogList.add(blog);
        user.setBlogList(blogList);
        insertBlog(blog);
        saveUser(user);

        // Friends of the user are notified.
        setNotification(user, blogId);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String,String>> removeBlog(String token, String blogId) {
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(401, "token is invalid");
        }
        // find blog.
        Blog blog = searchId(blogId);
        if (blog == null) {
            throw new CustomException(400, "blogId does not refer to a valid blog");
        }
        if (! user.getBlogList().contains(blog)) {
            throw new CustomException(400, "user are not blog author");
        }
        // delete from database
        mongoTemplate.remove(blog, COLLECTION_NAME);
        // delete from user list
        List<Blog> blogList = user.getBlogList();
        blogList.remove(blog);
        user.setBlogList(blogList);
        saveUser(user);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String, BlogResponse>> viewBlog(String token, String blogId) {
        // find blog.
        Blog blog = searchId(blogId);
        if (blog == null) {
            throw new CustomException(400, "blogId does not refer to a valid blog");
        }
        HashMap<String, BlogResponse> res = new HashMap<>();
        res.put("blog", new BlogResponse(blog));
        return new ResponseEntity<HashMap<String, BlogResponse>>(res, HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String, Object>> list(String token, String uId){
        User author = getUserByToken(token);
        if (author == null) {
            throw new CustomException(401, "token is invalid");
        }
        User user = mongoTemplate.findById(uId, User.class, "User");
        List<BlogsResponse> responseList = new ArrayList<>();
        for (Blog blog: user.getBlogList()) {
            BlogsResponse blogsResponse = new BlogsResponse(blog);
            responseList.add(blogsResponse);
        }
        HashMap<String, Object> res = new HashMap<>();
        res.put("blogs", responseList);
        return new ResponseEntity<HashMap<String, Object>>(res, HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String, Object>> listall(String token){
        List<BlogsResponse> responseList = new ArrayList<>();
        List<Blog> blogList = mongoTemplate.findAll(Blog.class, COLLECTION_NAME);
        for (Blog blog: blogList) {
            BlogsResponse blogsResponse = new BlogsResponse(blog);
            responseList.add(blogsResponse);
        }
        HashMap<String, Object> res = new HashMap<>();
        res.put("blogs", responseList);
        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
    }

    public User getUserByToken(String token) {
        String uid = jwtUtil.getIdFromToken(token);
        User user = null;
        user = mongoTemplate.findById(uid, User.class, "User");
        return user;
    }

    public void setNotification(User user, String blogId){
        for (User friend: user.getFirendsList()) {
            List<Notification> notificationList = friend.getNotificationList();
            Notification notification = new Notification("BLOG", user.getUserId(), friend.getUserId());
            notification.setSrcId(user.getUserId());
            notification.setToId(friend.getUserId());
            notificationList.add(0, notification);
            friend.setNotificationList(notificationList);
            // save database
            saveUser(friend);
        }
    }
}
