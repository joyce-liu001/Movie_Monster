package com.comp3900.movie_monster.user;


import com.comp3900.movie_monster.error.CustomException;
import com.comp3900.movie_monster.friendrequest.FriendRequest;
import com.comp3900.movie_monster.friendrequest.RequestResponse;
import com.comp3900.movie_monster.movie.Movie;
import com.comp3900.movie_monster.movie.MoviesResponse;
import com.comp3900.movie_monster.notification.Notification;
import com.comp3900.movie_monster.notification.NotificationResponse;
import com.comp3900.movie_monster.util.*;
import com.mongodb.client.MongoClients;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Repository("Person")
@Service
public class UserAccessService implements UserService {
    private static final String COLLECTION_NAME = "User";
    private static final String UPLOAD_FILE_COLLECTION_NAME = "UploadFile";

    @Resource
    private MongoTemplate mongoTemplate;

    private final JwtUtil jwtUtil = new JwtUtil();

    @Autowired
    private EmailController emailController;

    @Autowired
    private EnvConfig envConfig;

    @Override
    public void insertUser(User person) {
        mongoTemplate.save(person, COLLECTION_NAME);
    }
    @Autowired
    public UserAccessService(@Value("${spring.data.mongodb.uri}") String database_uri) {
        this.mongoTemplate = new MongoTemplate(MongoClients.create(database_uri), "3900project");
    }

    @Override
    public void register(User user) throws MessagingException {
        checkRegister(user);
        user.setUserId(UUID.randomUUID().toString());
//        String token = jwtUtil.generateToken(user);
//        List<String> tokens = user.getTokens();
//        tokens.add(token);
//        user.setTokens(tokens);
        user.setAdmin(false);
        user.setAvatar("");
        user.setUserStatus("public");
        String validateCode = CreateRandomStr.createRandomStr1(6);
        user.setValidationCode(validateCode);
        //Send email with short token to user's email address
        String url = envConfig.getFrontEndUrl() + "/auth/validate/" + validateCode;
        String text = "Please click this to validate your account: ";
        emailController.sendEmailWithHyperLink(user.getEmail(), "Validate your account", text, url);
        mongoTemplate.save(user, COLLECTION_NAME);
//        UserResponse res = new UserResponse(user.getUserId(), token, user.isAdmin());
//        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
        return;
    }

    @Override
    public ResponseEntity<UserResponse> login(String email, String password) {
        //1. check the password/email is correct
        checkPassword(email, password);
        if (!checkEmail(email)) {
            throw new CustomException(400, "invalid email");
        }

        //2. get the user
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));
        List<User> users = mongoTemplate.find(query, User.class, "User");
        User user = users.get(0);
        if (!user.getValidationCode().isEmpty()) {
            throw new CustomException(400, "Please validate your account first");
        }
        String token = jwtUtil.generateToken(user);
        List<String> tokens = user.getTokens();
        tokens.add(token);
        user.setTokens(tokens);
        mongoTemplate.save(user, COLLECTION_NAME);
        return new ResponseEntity<>(new UserResponse(user.getUserId(), token), HttpStatus.valueOf(200));

    }

    @Override
    public ResponseEntity<UserResponse> logout(String token) {
        User user = getUserByToken(token);
        assert user != null;
        List<String> tokens = user.getTokens();
        tokens.remove(token);
        user.setTokens(tokens);
        Query query = new Query();
        Update update = new Update().set("tokens", tokens);
        mongoTemplate.upsert(query, update, User.class, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<UserResponse> logoutAll(String token) {
//        if (!jwtUtil.checkToken(token)) {
//            return new ResponseEntity<>(HttpStatus.valueOf(403));
//        }
        User user = getUserByToken(token);
        assert user != null;
        List<String> tokens = new ArrayList<>();
        Query query = new Query();
        Update update = new Update().set("tokens", tokens);
        mongoTemplate.upsert(query, update, User.class, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<HashMap<String, ProfileResponse>> getProfile(String token, String uId) {
        // currentUser: token
        // target: uId
        User currentUser = getUserByToken(token);
        Set<String> blockedUsers = currentUser.getBlockedUsers();
        boolean isBlocked = blockedUsers.contains(uId);
        User user = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        if (user.getBlockedUsers().contains(currentUser.getUserId())) {
            throw new CustomException(403, "You can not access this user profile");
        }
        if (Objects.equals(user.getUserStatus(), "private")) {
            if (!user.getUserId().equals(currentUser.getUserId())) {
                throw new CustomException(403, "You can not access this user profile");
            }
        }
        HashMap<String, ProfileResponse> res = new HashMap<>();
        UploadFile imageFile =  mongoTemplate.findById(user.getAvatar(), UploadFile.class, "UploadFile");
        assert imageFile != null;
        String image = Base64.getEncoder().encodeToString(imageFile.getContent().getData());
        ProfileResponse profileResponse = new ProfileResponse(user, image);
        profileResponse.setBlocked(isBlocked);
        res.put("user", profileResponse);
        return new ResponseEntity<HashMap<String, ProfileResponse>>(res, HttpStatus.valueOf(200));
    }
    public void checkPassword(String email, String password) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));
        User res = mongoTemplate.findOne(query, User.class, "User");
        if (res != null) {
            String originPassword = res.getPassword();
            if (!Objects.equals(originPassword, password)) {
                throw new CustomException(400, "the password/email is not correct");
            }
        } else {
            throw new CustomException(400, "the password/email is not correct");
        }
    }
    @Override
    public ResponseEntity<UserResponse> addWatched(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movieId is invalid");
        }

        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        if (user.getWatchedList().contains(mv)) {
            throw new CustomException(400, "movie is already in the list");
        }
        List<Movie> watchlist = user.getWatchedList();
        watchlist.add(mv);
        user.setWatchedList(watchlist);
        mongoTemplate.save(user, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<UserResponse> removeWatched(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movie is not found");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        List<Movie> watchlist = user.getWatchedList();
        if (watchlist.contains(mv)) {
            watchlist.remove(mv);
            user.setWatchedList(watchlist);
            mongoTemplate.save(user, COLLECTION_NAME);
            return new ResponseEntity<>(HttpStatus.valueOf(200));
        } else {
            throw new CustomException(400, "movie not exist in list");
        }
    }
    @Override
    public ResponseEntity<UserResponse> addWish(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movie is not found");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        if (user.getWishList().contains(mv)) {
            throw new CustomException(400, "movie is already in the list");
        }
        List<Movie> wishlist = user.getWishList();
        wishlist.add(mv);
        user.setWishList(wishlist);
        mongoTemplate.save(user, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<UserResponse> removeWish(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movie is not found");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        List<Movie> wishlist = user.getWishList();
        if (wishlist.contains(mv)) {
            wishlist.remove(mv);
            user.setWishList(wishlist);
            mongoTemplate.save(user, COLLECTION_NAME);
            return new ResponseEntity<>(HttpStatus.valueOf(200));
        } else {
            throw new CustomException(400, "movie not exist in list");
        }
    }
    @Override
    public ResponseEntity<UserResponse> addFavourite(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movie is not found");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        if (user.getFavouriteList().contains(mv)) {
            throw new CustomException(400, "movie is already in the list");
        }
        List<Movie> favoritelsit = user.getFavouriteList();
        favoritelsit.add(mv);
        user.setFavouriteList(favoritelsit);
        mongoTemplate.save(user, COLLECTION_NAME);
        return new ResponseEntity<>(HttpStatus.valueOf(200));
    }
    @Override
    public ResponseEntity<UserResponse> removeFavourite(String token, String movieId) {
        Movie mv = null;
        mv = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (mv == null) {
            throw new CustomException(400, "movie is not found");
        }
        User user = getUserByToken(token);
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        List<Movie> favlist = user.getFavouriteList();
        if (favlist.contains(mv)) {
            favlist.remove(mv);
            user.setFavouriteList(favlist);
            mongoTemplate.save(user, COLLECTION_NAME);
            return new ResponseEntity<>(HttpStatus.valueOf(200));
        } else {
            //movie is not in the user's list
            throw new CustomException(400, "movie not exist in list");
        }
    }
    public ResponseEntity<HashMap<String, List<HashMap<String, Object>>>> getAllUser(String token) {
        List<User> users = mongoTemplate.findAll(User.class, COLLECTION_NAME);
        List<HashMap<String, Object>> res = new ArrayList<>();
        for (User u: users) {
            HashMap<String, Object> tmp = new HashMap<String, Object>();
            tmp.put("uId", u.getUserId());
            tmp.put("username", u.getUsername());
            tmp.put("image", u.getAvatar());
            tmp.put("isAdmin", u.isAdmin());
            res.add(tmp);
        }
        HashMap<String, List<HashMap<String, Object>>> result = new HashMap<>();
        result.put("users", res);
        return new ResponseEntity<>(result, HttpStatus.valueOf(200));
    }


    private void checkRegister(User user){
        //1.check the email is invalid
        boolean isCorrect = checkEmail(user.getEmail());
        if (!isCorrect) {
            throw new CustomException(400, "email is not correct");
        }
        //check the username length is validated
        String username = user.getUsername();
        if (username.length() < 1 || username.length() >= 20) {
            throw new CustomException(400, "username length must between 1 to 20");
        }
        //2. check the email is taken
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(user.getEmail()));
        String em = user.getEmail();
        if (mongoTemplate.find(query, User.class, "User").size() == 1) {
            throw new CustomException(400, "email is been taken");
        }

        //3. check password
        String password = user.getPassword();
        if (password.length() < 6) {
            throw new CustomException(400, "password length is smaller than 6");
        }

        //4. check username is taken
        query = new Query();
        query.addCriteria(Criteria.where("username").is(user.getUsername()));
        if (mongoTemplate.find(query, User.class, "User").size() == 1) {
            throw new CustomException(400, "username is been taken");
        }
    }

    private boolean checkEmail(String email) {
        String REGEX="^\\w+((-\\w+)|(\\.\\w+))*@\\w+(\\.\\w{2,3}){1,3}$";
        Pattern p = Pattern.compile(REGEX);
        Matcher matcher=p.matcher(email);
        return matcher.matches();
    }
    @Override
    public User getOneUserFromEmail(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));
        List<User> users = mongoTemplate.find(query, User.class, "User");
        if (users.size() == 1) {
            return users.get(0);
        }
        return null;
    }

    @Override
    public void updateProfile(String uId, String username, String description, String oldPassword, String newPassword,
                       String age, String gender, String userStatus) {
        User user = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        assert user != null;
        if (!Objects.equals(username, "")) {
            user.setUsername(username);
        }
        if (!Objects.equals(description, "")) {
            user.setDescription(description);
        }
        if (!Objects.equals(oldPassword, "")) {
            if (!Objects.equals(oldPassword, user.getPassword())) {
                throw new CustomException(400, "password is not correct");
            }
            if (newPassword.length() < 6) {
                throw new CustomException(400, "password length is smaller than 6");
            }
            user.setPassword(newPassword);
        }
        if(!Objects.equals(age, "")){
            user.setAge(age);
        }
        if(!Objects.equals(gender, "")) {
            user.setGender(gender);
        }
        if(!Objects.equals(userStatus, "")) {
            user.setUserStatus(userStatus);
        }
        mongoTemplate.save(user, COLLECTION_NAME);
    }

    public User getUserByToken(String token) {
        String uid = jwtUtil.getIdFromToken(token);
        return mongoTemplate.findById(uid, User.class, COLLECTION_NAME);
    }

    @Override
    public void blockUser(String curId, String uId) {
        if (curId.equals(uId)) {
            throw new CustomException(400, "cannot block yourself");
        }

        User user = mongoTemplate.findById(curId, User.class, COLLECTION_NAME);
        User target = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        if (target == null) {
            throw new CustomException(400, "user is not found");
        }

        assert user != null;
        Set<String> blockedList = user.getBlockedUsers();
        blockedList.add(uId);
        user.setBlockedUsers(blockedList);
        mongoTemplate.save(user, COLLECTION_NAME);
    }

    @Override
    public void passwordResetRequest(String email) {
        User user = getOneUserFromEmail(email);
        if (user == null) {
            throw new CustomException(400, "email is invalid");
        }
        String resetCode = CreateRandomStr.createRandomStr2(6);
        user.setResetCode(resetCode);
        mongoTemplate.save(user, COLLECTION_NAME);
        emailController.sendEmail(email, "Password Reset", "Your reset code is \n" + resetCode);
    }

    @Override
    public void passwordReset(String resetCode, String newPassword) {
        Query query = new Query();
        query.addCriteria(Criteria.where("resetCode").is(resetCode));
        List<User> users = mongoTemplate.find(query, User.class, COLLECTION_NAME);
        if (users.size() == 0) {
            throw new CustomException(400, "reset code is invalid");
        }
        User user = users.get(0);
        user.setPassword(newPassword);
        user.setResetCode("");
        user.setTokens(new ArrayList<>());
        mongoTemplate.save(user, COLLECTION_NAME);
    }

    @Override
    public ResponseEntity<UserResponse> validateCode(String validationCode) {
        Query query = new Query();
        query.addCriteria(Criteria.where("validationCode").is(validationCode));
        List<User> users = mongoTemplate.find(query, User.class, COLLECTION_NAME);
        if (users.size() == 0) {
            throw new CustomException(400, "validation code is invalid");
        }
        User user = users.get(0);
        user.setValidationCode("");
        String token = jwtUtil.generateToken(user);
        List<String> tokens = user.getTokens();
        tokens.add(token);
        user.setTokens(tokens);
        user.setAdmin(false);
        user.setAvatar("");
        user.setUserStatus("public");
        UserResponse res = new UserResponse(user.getUserId(), token, user.isAdmin());
        mongoTemplate.save(user, COLLECTION_NAME);
        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
    }

    @Override
    public void unblockUser(String curId, String uId) {
        if (curId.equals(uId)) {
            throw new CustomException(400, "cannot unblock yourself");
        }
        User user = mongoTemplate.findById(curId, User.class, COLLECTION_NAME);
        User target = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        if (target == null) {
            throw new CustomException(400, "user is not found");
        }

        assert user != null;
        Set<String> blockedList = user.getBlockedUsers();
        if (!blockedList.contains(uId)){
            throw new CustomException(400, "user is not in blocked list");
        } else {
            blockedList.remove(uId);
            user.setBlockedUsers(blockedList);
            mongoTemplate.save(user, COLLECTION_NAME);
        }
    }

    @Override
    public void updateUserStatus(String uId, String userStatus) {
        User user = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        assert user != null;
        String []check = new String[]{"public", "private", "friends"};
        if (!Arrays.asList(check).contains(userStatus)) {
            throw new CustomException(400, "user status is invalid");
        }
        user.setUserStatus(userStatus);
        mongoTemplate.save(user, COLLECTION_NAME);
    }

    @Override
    public void userUploadProfilePicture(String uId, String userImage, MultipartFile file) throws IOException {
        User user = mongoTemplate.findById(uId, User.class, COLLECTION_NAME);
        if (file.getSize() > 1000000) {
            throw new CustomException(400, "file size is too large");
        }
        assert user != null;
        UploadFile uploadFile = new UploadFile();
        uploadFile.setName(userImage);
        uploadFile.setCreatedTime(new Date());
        uploadFile.setContent(new Binary(file.getBytes()));
        uploadFile.setContentType(file.getContentType());
        uploadFile.setSize(file.getSize());
        user.setAvatar(uploadFile.getId());
        mongoTemplate.save(uploadFile, UPLOAD_FILE_COLLECTION_NAME);
        mongoTemplate.save(user, COLLECTION_NAME);
    }
    @Override
    public void friendrequestCreate(String token, String toUId) {
        User user = getUserByToken(token);
        if (user == null) {
            // toUId valid?
            throw new CustomException(400, "user is not found");
        }
        if (user.getUserId().equals(toUId)) {
            // add themself?
            throw new CustomException(400, "cannot add yourself");
        }
        // check they are friend or not
        User toUser = mongoTemplate.findById(toUId, User.class, COLLECTION_NAME);
        if (user.getFirendsList().contains(toUser)) {
            throw new CustomException(401, "already friend");
        }
        // check block user
        if (user.getBlockedUsers().contains(toUId) || toUser.getBlockedUsers().contains(user.getUserId())) {
            throw new CustomException(401, "Blocked User");
        }
        // create friend request
        FriendRequest newRequest = new FriendRequest(user);
        // Sends a friend request to another user.
        List<FriendRequest> listrequest = toUser.getFriendRequestsList();
        listrequest.add(0, (FriendRequest) newRequest);
        toUser.setFriendRequestsList(listrequest);

        // send notification.
        Notification notification = new Notification("FRIEND_REQUEST", user.getUserId(), toUId);
        List<Notification> listnotif = toUser.getNotificationList();
        listnotif.add(0,notification);
        toUser.setNotificationList(listnotif);
        this.insertUser(toUser);
        // save in  database
        mongoTemplate.save(newRequest, "Request");
    }
    public ResponseEntity<HashMap<String, Object>> friendrequestView(String token) {
        User user = getUserByToken(token);
        if (user == null) {
            // toUId valid?
            throw new CustomException(400, "user is not found");
        }
        // View all of the auth user's friend requests
        List<RequestResponse> requestResponseList = new ArrayList<>();
        for (FriendRequest friendRequest: user.getFriendRequestsList()) {
            requestResponseList.add(new RequestResponse(friendRequest));
        }
        HashMap res = new HashMap<>();
        res.put("friendRequests", requestResponseList);
        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
    }
    public void requestConfirm(String token, String friendRequestId) {
        User user = getUserByToken(token);
        if (user == null) {
            // toUId valid?
            throw new CustomException(400, "user is not found");
        }
        FriendRequest request = mongoTemplate.findById(friendRequestId, FriendRequest.class, "Request");
        if (request == null) {
            throw new CustomException(400, "friendRequestId does not refer to a valid request");
        }

        // The sender should receive a notification
        User srcUser = mongoTemplate.findById(request.getUId(), User.class, COLLECTION_NAME);
        Notification confirmRequest = new Notification("FRIEND_CONFIRMED", user.getUserId(), srcUser.getUserId());
        List<Notification> listnotif = srcUser.getNotificationList();
        listnotif.add(0,confirmRequest);
        srcUser.setNotificationList(listnotif);
        // delete confirm request
        List<FriendRequest> userRequest = user.getFriendRequestsList();
        userRequest.remove(request);
        user.setFriendRequestsList(userRequest);

        // Accepts a friend request from another sender.
        List<User> srcFriends = srcUser.getFirendsList();
        List<User> toFriends = user.getFirendsList();
        toFriends.add(srcUser);
        srcFriends.add(user);
        srcUser.setFirendsList(srcFriends);
        user.setFirendsList(toFriends);
        this.insertUser(user);
        this.insertUser(srcUser);
    }
    public void requestDeny(String token, String friendRequestId) {
        User user = getUserByToken(token);
        if (user == null) {
            // toUId valid?
            throw new CustomException(400, "user is not found");
        }
        FriendRequest request = mongoTemplate.findById(friendRequestId, FriendRequest.class, "Request");
        if (request == null) {
            throw new CustomException(400, "friendRequestId does not refer to a valid request");
        }
        List<FriendRequest> userRequest = user.getFriendRequestsList();
        userRequest.remove(request);
        user.setFriendRequestsList(userRequest);
        this.insertUser(user);
    }

    public ResponseEntity<HashMap<String, Object>> getNotifications(String token) {
        User user = getUserByToken(token);
        if (user == null) {
            // toUId valid?
            throw new CustomException(400, "user is not found");
        }
        HashMap res = new HashMap<>();
        List<NotificationResponse> notificationResponses = new ArrayList<>();
        for (Notification notification: user.getNotificationList()) {
            notificationResponses.add(new NotificationResponse(notification));
        }
        res.put("notifications", notificationResponses);
        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, Boolean>> checkToken(String token) {
        HashMap<String, Boolean> res = new HashMap<>();
        if (token.equals("")) {
            res.put("isLoggedIn", false);
            return new ResponseEntity<>(res, HttpStatus.valueOf(200));
        }
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
        res.put("isLoggedIn", true);
        return new ResponseEntity<>(res, HttpStatus.valueOf(200));
    }

    @Override
    public ResponseEntity<HashMap<String, Object>> getRecommendations(String token) throws IOException, InterruptedException {
        if (Objects.equals(token, "")) {
            HashMap<String, Object> result = new HashMap<>();
            result.put("movies", new ArrayList<>());
            return new ResponseEntity<>(result, HttpStatus.valueOf(200));
        }
        String uId = jwtUtil.getIdFromToken(token);
        User user = mongoTemplate.findById(uId, User.class, "User");
        if (user == null) {
            throw new CustomException(400, "user is not found");
        }
        if(user.getWatchedList().size() == 0) {
            HashMap<String, Object> res = new HashMap<>();
            res.put("movies", new ArrayList<>());
            return new ResponseEntity<>(res, HttpStatus.valueOf(200));
        }
        String path = "backend/src/main/java/com/comp3900/movie_monster/user/beta_algorithm.py";
        if(Files.notExists(Paths.get(path)) ){
            path = "src/main/java/com/comp3900/movie_monster/user/beta_algorithm.py";
        }
        ProcessBuilder processBuilder = new ProcessBuilder("python3", path, uId);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line = null;
        HashMap<String, Object> result = new HashMap<>();
        List<MoviesResponse> moviesList = new ArrayList<>();

        process.waitFor();
        if (process.exitValue() != 0) {
            String error = in.lines().collect(Collectors.joining(System.lineSeparator()));
            throw new CustomException(500, "Internal System Error: " + error);
        }
        while ((line = in.readLine()) != null) {
            for (String movieId: line.split(",")) {
                Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
                if (movie == null) {
                    throw new CustomException(400, "movie is not found");
                }
               moviesList.add(new MoviesResponse(movie));
            }
            result.put("movies", moviesList);
        }
        in.close();
        return new ResponseEntity<>(result, HttpStatus.valueOf(200));
    }
    @Override
    public void movieshare(String token, String friendId, String movieId) {
        User user = getUserByToken(token);
        if (user == null) {
            // token
            throw new CustomException(400, "user is not found");
        }

        // check friendId does no refer to a valid user
        User friend = mongoTemplate.findById(friendId, User.class, COLLECTION_NAME);
        if (friend == null) {
            throw new CustomException(400, "friend is not found");
        }
        // check friendId does not refer to a friend
        if (! user.getFirendsList().contains(friend)) {
            throw new CustomException(400, "you are not friend");
        }
        // check movieId does not refer to a valid movie
        Movie movie = mongoTemplate.findById(movieId, Movie.class, "Movie");
        if (movie == null) {
            throw new CustomException(400, "movieId does not refer to a valid movie");
        }
        // Shares a movie with a friend. The friend should receive a notification.
        // send notification to writer
        Notification notification = new Notification("MOVIE_SHARE", user.getUserId(), friend.getUserId());
        notification.setMovieId(movieId);
        // send notification.
        List<Notification> listnotif = friend.getNotificationList();
        listnotif.add(0, notification);
        friend.setNotificationList(listnotif);
        mongoTemplate.save(friend, "User");
    }

}
