package com.comp3900.movie_monster.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse  {
    @JsonProperty("uId")
    private String uId;
    private String token;
    private boolean isAdmin;

    public UserResponse(String uId, String token) {
        this.uId = uId;
        this.token = token;
    }
}
