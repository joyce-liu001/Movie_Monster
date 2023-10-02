package com.comp3900.movie_monster.user;

import com.comp3900.movie_monster.friendrequest.RequestResponse;
import com.comp3900.movie_monster.movie.MoviesResponse;
import com.comp3900.movie_monster.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("user")
@RestController
public class UserController {
    private final UserService userService;
    private final  JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("add")
    public void addPerson(@RequestBody User person) {
        userService.insertUser(person);
    }

    @GetMapping("profile")
    public ResponseEntity<HashMap<String, ProfileResponse>> getProfile(@RequestHeader(name = "Authorization") String token, @RequestParam(value = "uId") String uId) {
        return userService.getProfile(token, uId);
    }

    @PostMapping("watchedlist/add")
    public ResponseEntity<UserResponse> addWatchedList(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.addWatched(token, movieId);
    }
    @PostMapping("wishlist/add")
    public ResponseEntity<UserResponse> addWishList(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.addWish(token, movieId);
    }

    @PostMapping("favouritelist/add")
    public ResponseEntity<UserResponse> addFavoriteList(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.addFavourite(token, movieId);
    }

    @DeleteMapping("watchedlist/remove")
    public ResponseEntity<UserResponse> removeWatchedList(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.removeWatched(token, movieId);
    }
    @DeleteMapping("wishlist/remove")
    public ResponseEntity<UserResponse> removeWishList(@RequestHeader(name = "Authorization") String token,@RequestParam Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.removeWish(token, movieId);
    }

    @DeleteMapping("favouritelist/remove")
    public ResponseEntity<UserResponse> removeFavoriteList(@RequestHeader(name = "Authorization") String token, @RequestParam Map<String, String> js) {
        String movieId = js.get("movieId");
        return userService.removeFavourite(token, movieId);
    }

    @PutMapping("profile/update")
    public void updateProfile(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String curId = jwtUtil.getIdFromToken(token);
        String username = js.get("username");
        String description = js.get("description");
        String oldPassword = js.get("oldPassword");
        String newPassword = js.get("newPassword");
        String age = js.get("age");
        String gender = js.get("gender");
        String userStatus = js.get("userStatus");
        userService.updateProfile(curId, username, description, oldPassword, newPassword, age, gender, userStatus);
    }

    @PostMapping("block")
    public void blockUser(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String curId = jwtUtil.getIdFromToken(token);
        String uId = js.get("uId");
        userService.blockUser(curId, uId);
    }

    @PostMapping("unblock")
    public void unblockUser(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String curId = jwtUtil.getIdFromToken(token);
        String uId = js.get("uId");
        userService.unblockUser(curId, uId);
    }

    @PutMapping("profile/status")
    public void updateUserStatus(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String curId = jwtUtil.getIdFromToken(token);
        String userStatus = js.get("userStatus");
        userService.updateUserStatus(curId, userStatus);
    }

    @PostMapping("profile/uploadphoto")
    public void uploadPhoto(@RequestHeader(name = "Authorization") String token,
                            @RequestParam(value = "imageFile") MultipartFile file) throws IOException {
        String curId = jwtUtil.getIdFromToken(token);
//        String userImage= js.get("userImage");
        userService.userUploadProfilePicture(curId, "userImage", file);
    }

    @PostMapping("friendrequest")
    public void createFriendrequest(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String toUId = js.get("toUId");
        userService.friendrequestCreate(token, toUId);
    }

    @PostMapping("viewfriendrequests")
    public ResponseEntity<HashMap<String, Object>> viewFriendrequest(@RequestHeader(name = "Authorization") String token) {
        return userService.friendrequestView(token);
    }
    @PostMapping("confirmrequest")
    public void confirmRequest(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String friendRequestId = js.get("friendRequestId");
        userService.requestConfirm(token, friendRequestId);
    }
    @PostMapping("denyrequest")
    public void denyRequest(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String friendRequestId = js.get("friendRequestId");
        userService.requestDeny(token, friendRequestId);
    }


    @GetMapping("notifications")
    public ResponseEntity<HashMap<String, Object>> notifications(@RequestHeader(name = "Authorization") String token) {
        return userService.getNotifications(token);
    }

    @GetMapping("recommendations")
    public ResponseEntity<HashMap<String, Object>> recommendations(@RequestHeader(name = "Authorization") String token) throws IOException, InterruptedException {
        return userService.getRecommendations(token);
    }

    @PostMapping("sharemovie")
    public void shareMovie(@RequestHeader(name = "Authorization") String token, @RequestBody Map<String, String> js) {
        String friendId = js.get("friendId");
        String movieId = js.get("movieId");
        userService.movieshare(token, friendId, movieId);
    }
}





