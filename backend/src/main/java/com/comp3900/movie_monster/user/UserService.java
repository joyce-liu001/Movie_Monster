package com.comp3900.movie_monster.user;

//import com.google.gson.JsonObject;

import com.comp3900.movie_monster.friendrequest.RequestResponse;
import com.comp3900.movie_monster.movie.MoviesResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public interface UserService {
    void insertUser(User user);
    public ResponseEntity<HashMap<String, List<HashMap<String, Object>>>> getAllUser(String token);

    void register(User user) throws MessagingException;

    ResponseEntity<UserResponse> login(String email, String password);

    ResponseEntity<UserResponse> logout(String token);

    ResponseEntity<UserResponse> logoutAll(String token);

    public ResponseEntity<HashMap<String, ProfileResponse>> getProfile(String token, String uId);

    ResponseEntity<UserResponse> addWatched(String token, String movieId);
    ResponseEntity<UserResponse> removeWatched(String token, String movieId);
    ResponseEntity<UserResponse> addWish(String token, String movieId);
    ResponseEntity<UserResponse> removeWish(String token, String movieId);
    ResponseEntity<UserResponse> addFavourite(String token, String movieId);
    ResponseEntity<UserResponse> removeFavourite(String token, String movieId);

    User getOneUserFromEmail(String email);

    void updateProfile(String uId, String username, String description, String oldPassword, String newPassword,
                       String age, String gender, String userStatus);

    void blockUser(String curId, String uId);

    void passwordResetRequest(String email);

    void passwordReset(String resetCode, String newPassword);

    ResponseEntity<UserResponse> validateCode(String validationCode);

    void unblockUser(String curId, String uId);

    void updateUserStatus(String uId, String userStatus);

    void userUploadProfilePicture(String uId, String userImage, MultipartFile file) throws IOException;

    void friendrequestCreate(String token, String toUId);
    ResponseEntity<HashMap<String, Object>> friendrequestView(String token);
    void requestConfirm(String token, String friendRequestId);
    void requestDeny(String token, String friendRequestId);
    ResponseEntity<HashMap<String, Object>> getNotifications(String token);

    ResponseEntity<HashMap<String, Boolean>> checkToken(String token);

    void movieshare(String token, String friendId, String movieId);
    ResponseEntity<HashMap<String, Object>> getRecommendations(String token) throws IOException, InterruptedException;
}
