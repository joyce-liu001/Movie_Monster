package com.comp3900.movie_monster.friendrequest;
import com.comp3900.movie_monster.user.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Data
@NoArgsConstructor
public class FriendRequest {
    @MongoId
    private String friendRequestId;
    private String uId;
    private String username;
    public FriendRequest(User srcUser) {
        super();
        this.friendRequestId = UUID.randomUUID().toString();
        this.uId = srcUser.getUserId();
        this.username = srcUser.getUsername();
    }
}