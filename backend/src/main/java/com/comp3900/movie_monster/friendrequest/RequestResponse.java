package com.comp3900.movie_monster.friendrequest;

import com.comp3900.movie_monster.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@SuppressWarnings("Lombok")
@Data
@AllArgsConstructor
public class RequestResponse {
    private String friendRequestId;
    private String uId;
    private String username;
    public RequestResponse(FriendRequest request) {
        this.friendRequestId = request.getFriendRequestId();
        this.uId = request.getUId();
        this.username = request.getUsername();
    }
}
