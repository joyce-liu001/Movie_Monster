package com.comp3900.movie_monster.user;


//import com.comp3900.movie_monster.util.AuthenticationRequest;
//import com.comp3900.movie_monster.util.AuthenticationResponse;
//import com.comp3900.movie_monster.util.JwtUtil;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;


@RequestMapping("auth")
@RestController
@AllArgsConstructor
public class AuthController {

    @Autowired
    private final UserService userService;

    @PostMapping(value = "register")
    @ResponseBody
    public void register(@RequestBody User user) throws MessagingException {
        this.userService.register(user);
    }

    @PostMapping(value = "validate")
    public ResponseEntity<UserResponse> validate(@RequestBody Map<String, String> js) {
        String validationCode = js.get("validationCode");
        return this.userService.validateCode(validationCode);
    }

    @PostMapping(value = "login")
    public ResponseEntity<UserResponse> login(@RequestBody Map<String, String> js){
        String email = js.get("email");
        String password = js.get("password");
        return this.userService.login(email, password);
    }

    @PostMapping(value = "logout")
    public ResponseEntity<UserResponse> logout(@RequestHeader(name = "Authorization") String token) {
        return this.userService.logout(token);
    }

    @PostMapping(value = "logout/all")
    public ResponseEntity<UserResponse> logoutall(@RequestHeader(name = "Authorization") String token) {
        return this.userService.logoutAll(token);
    }

    @PostMapping(value = "passwordreset/request")
    public void passwordResetRequest(@RequestBody Map<String, String> js) {
        String email = js.get("email");
        this.userService.passwordResetRequest(email);
    }

    @PostMapping(value = "passwordreset/reset")
    public void passwordReset(@RequestBody Map<String, String> js) {
        String resetCode = js.get("resetCode");
        String newPassword = js.get("newPassword");
        this.userService.passwordReset(resetCode, newPassword);
    }

    @GetMapping(value="checktoken")
    public ResponseEntity<HashMap<String, Boolean>> checkToken(@RequestHeader(name = "Authorization") String token) {
        return this.userService.checkToken(token);
    }
}
