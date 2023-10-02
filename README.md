# Capstone Project COMP3900 F16A - Impregnable

## Interface

If necessary, you can find:
-   Sprint 1's interface in [documents/interfaces/sprint1-interface.md](documents/interfaces/sprint1-interface.md).
-   Sprint 2's interface in [documents/interfaces/sprint2-interface.md](documents/interfaces/sprint2-interface.md).

### Data Types

| Variable Name | Type |
| --- |--- |
| contains prefix **num** | `number`, specifically integer |
| contains prefix **is** | `boolean` |
| contains prefix **ignore** | `boolean` |
| contains prefix **has** | `boolean` |
| contains prefix **time** | `number`, specifically integer timestamp in **milliseconds**, e.g. `1658378863245` |
| contains suffix **String** | `string` |
| contains suffix **Id** | `string` |
| contains substring **name** | `string` |
| contains substring **code** | `string` |
| contains substring **password** | `string` |
| contains substring **rating** | `number`, specifically float |
| contains substring **content** | `string` |
| is exactly **contentRating** | `string`, e.g. PG-13, M15+, R, [etc](https://help.imdb.com/article/contribution/titles/certificates/GU757M8ZJ9ZPXB39?ref_=helpart_nav_27#australia). |
| is exactly **titles** | `string[]` |
| is exactly **age** | `number`, specifically integer |
| is exactly **gender** | `string` |
| is exactly **genre** | `string` |
| is exactly **sortBy** | `string`: 'name' \| 'rating' |
| is exactly **director** | `string` |
| is exactly **token** | `string` |
| is exactly **userStatus** | `string` that is one of `"public"`, `"private"` or `"friends"`|
| is exactly **user** | Object containing keys `{uId, username, email, age, gender, isAdmin, image, wishList, watchList, favouriteList, userStatus, isBlocked}` |
| is exactly **users** | Array of objects, where each object has the keys `{uId, username, image, isAdmin}` |
| is exactly **fullTitle** | `string` |
| is exactly **description** | `string` |
| is exactly **image** | `string` (url link) |
| is exactly **releaseDate** | `string`|
| is exactly **directorList** | Array of objects, where each objects contain the keys `{id, name}` |
| is exactly **asCharacter** | `string` |
| is exactly **actorList** | Array of objects, where each objects contain the keys `{id, image, name, asCharacter}` |
| is exactly **genreList** | `Array<string>`. |
| is exactly **reviews** | Array of objects, where each objects contain the keys `{reviewId, reviewerId, reviewerUsername, reviewString, rating, numThumbsUp, numThumbsDown, isThisUserThumbsUp, isThisUserThumbsDown, timeSent}` |
| is exactly **movie** | Object containing keys `{movieId, fullTitle, description, isWish, isWatched, isFavourite, image, releaseDate, rating, imdbRating, directorList, actorList, genreList, reviews, hasReviewed, contentRating, imdbRatingVotes}` |
| is exactly **movies** | Array of objects, where each object contains the keys `{movieId, fullTitle, image, rating }` |
| is exactly **friendRequests** | Array of objects, where each object contains the keys `{ friendRequestId, uId, username, imageFile }` |
| is exactly **notificationType** | `string` with values `"FRIEND_REQUEST", "FRIEND_CONFIRMED", "THUMBS", "MOVIE_SHARE", "BLOG"` |
| is exactly **notifications** | Array of objects, where each object contains the keys `{ notificationType, movieId, reviewId, blogId }` |
| is exactly **movieIdList** | `movieId[]` |
| is exactly **blog** | Object containing keys `{ blogId, title, content, timeCreated, senderId, senderUsername }` |
| is exactly **blogs** | `blog[]` |
| is exactly **quiz** | Object containing keys `{ quizId, quizTitle, quizSynopsis, quizContent, timeCreated }` |

### Routes

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>

  <tr>
    <td>
        <code>/movie/review</code><br/><br/>
        Add a review to the given movie. The movie will automatically be added to the user's watched list.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ movieId, rating, reviewString }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ reviewId }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the code is invalid</li>
            <li>the rating is not strictly positive (rating <= 0)</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/list</code><br/><br/>
        Returns all movies that matches specific criteria from the start index to start + 10, and return the new end index. If the last movie has been returned, the value of end will be -1.
        The rating should not be affected by any blocked users.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameters</b><br/>
        <code>{keyword, genre, director, sortBy, start, ignoreWish, ignoreWatch, ignoreFavourite}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{movies, end}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/block</code><br/><br/>
        Blocks the given user.
        <ul>
            <li>All friend requests between the two users should be removed.</li>
            <li>The targetted user should be unfriended if they are friends</li>
        </ul>
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameter</b><br/>
        <code>{uId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the userId is invalid</li>
            <li>the user is already blocked</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/details</code><br/><br/>
        Return all details about a movie.
        <ul>
            <li>If a token is provided, the average rating of the movie should not take into account the reviews of users that have been blocked by the auth user.</li>
            <li>Also, reviews posted by the auth user should not be present in the returned reviews.</li>
        </ul>
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{movie}</code>
    </td>
    <td>
        TODO
    </td>
  </tr>

</table>

#### Invalid Token

For all routes above, if there is a token parameter and the supplied token argument is invalid, an error with code 401 is returned.

### Sprint 3 interface

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>/user/profile/uploadphoto</code><br/><br/>
        Uploads a photo to the user's profile
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token, Content-Type: "multipart/form-data"}</code><br/><br/>
        <b>Body Parameters (form</b><br/>
        <code>{ imageFile }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>The image is not a JPG/JPEG/PNG</li>
            <li>The image is over 2MB</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/recommendations</code><br/><br/>
        Gets recommendations about the given movie based on the genre and director.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{ movieId, isGenre, isDirector }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ movies }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>movieId does not refer to a valid movie</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/recommendations</code><br/><br/>
        Gets recommendations based on the user's reviews
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ movies }</code>
    </td>
    <td>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/friendrequest</code><br/><br/>
        Sends a friend request to another user. The receipient should receive a notification.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ toUId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>toUId does not refer to a valid user</li>
            <li>toUId refers to the auth user (i.e. trying to add themself)</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/viewfriendrequests</code><br/><br/>
        View all of the auth user's friend requests
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ friendRequests }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>fromUId does not refer to a valid user</li>
            <li>fromUId has not sent a friend request</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/confirmrequest</code><br/><br/>
        Accepts a friend request from another sender. The sender should receive a notification.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ friendRequestId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>friendRequestId does not refer to a valid request</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/denyrequest</code><br/><br/>
        Reject a friend request from another user
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ friendRequestId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>friendRequestId does not refer to a valid request</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/sharemovie</code><br/><br/>
        Shares a movie with a friend. The friend should receive a notification.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>POST Parameters</b><br/>
        <code>{ friendId, movieId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>friendId does no refer to a valid user</li>
            <li>friendId does not refer to a friend</li>
            <li>movieId does not refer to a valid movie</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/notifications</code><br/><br/>
        Get all notifications for the current user
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ notifications }</code>
    </td>
    <td>
        <ul>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/create</code><br/><br/>
        Post a blog. Friends of the user are notified.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ title, content }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ blogId }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>Title is empty</li>
            <li>content is empty</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/edit</code><br/><br/>
        Post a blog. Friends of the user are notified.
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ blogId, title, content }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>Title is empty</li>
            <li>content is empty</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/remove</code><br/><br/>
        Removes a blog.
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{ blogId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>blogId does not refer to a valid blog</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/view</code><br/><br/>
        View the current blog
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{ blogId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ blog }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>blogId does not refer to a valid blog</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/list</code><br/><br/>
        List blogs belonging to the targetted (uId) user
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{ uId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ blogs }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>uId does not refer to a valid user</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/blog/listall</code><br/><br/>
        List all blogs
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ blogs }</code>
    </td>
    <td>
        N/A
    </td>
  </tr>

  <tr>
    <td>
        <code>/quiz/create</code><br/><br/>
        Creates a quiz
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId, quizTitle, quizSynopsis, quizContent}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>movieId does not refer to a valid movie</li>
            <li>the movie already has a quiz created</li>
            <li>quizTitle is empty</li>
            <li>quizSypnosis is empty</li>
            <li>quizContent is not valid JSON</li>
        </ul>
        Throw error with code 403 if:
        <ul>
            <li>auth user is not an admin</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/quiz/edit</code><br/><br/>
        Edits a quiz
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId, quizSynopsis, quizContent}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>movieId does not refer to a valid movie</li>
            <li>quizTitle is empty</li>
            <li>quizSypnosis is empty</li>
            <li>quizContent is not valid JSON</li>
        </ul>
        Throw error with code 403 if:
        <ul>
            <li>auth user is not an admin</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/quiz/remove</code><br/><br/>
        Removes a quiz
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code><br/><br/>
        <b>Query Parameters</b><br/>
        <code>{ movieId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>movieId does not refer to a valid movie</li>
        </ul>
        Throw error with code 403 if:
        <ul>
            <li>auth user is not an admin</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/quiz/details</code><br/><br/>
        Return all details relating to the quiz
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{ movieId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ quiz }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>quizId does not refer to a valid quiz</li>
        </ul>
    </td>
  </tr>

</table>

#### Note:

Change token to be in headers
