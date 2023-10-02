# Capstone Project COMP3900 F16A - Impregnable

## Interface

If necessary, you can find Sprint 1's interface in [documents/interfaces/sprint1-interface.md](documents/interfaces/sprint1-interface.md).

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
| is exactly **movie** | Object containing keys `{movieId, fullTitle, description, isWish, isWatched, isFavourite, image, releaseDate, rating, imdbRating, directorList, actorList, genreList, reviews, hasReviewed, contentRating}` |
| is exactly **movies** | Array of objects, where each object contains the keys `{movieId, fullTitle, image, rating }` |

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
        <code>/auth/checktoken</code><br/><br/>
        Checks if the given token is still valid for use.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 401 if:
        <ul>
            <li>token is invalid (e.g. tampered with)</li>
            <li>token does not refer to any user</li>
            <li>token has expired.</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/auth/register</code><br/><br/>
        Registers a new user and logs the user in. The user will be sent an email
        containing a link that they can click on to validate their verification link
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{username, email, password, age, gender }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>username is not between 1 and 20 characters</li>
            <li>username is already taken</li>
            <li>email is invalid</li>
            <li>email is already taken</li>
            <li>password is less than 6 characters</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/auth/validate</code><br/><br/>
        Validate the email corresponding to the given code
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{ validationCode }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{token, uId, isAdmin}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the code is invalid</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/auth/passwordreset/request</code><br/><br/>
        Send a reset code to an email address to reset the corresponding user's password
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{ email }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>the email is invalid or has not been taken</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/auth/passwordreset/reset</code><br/><br/>
        Attempts to reset a password using the code
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{ resetCode, newPassword }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the code is invalid</li>
        </ul>
    </td>
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
        <code>/review/thumbsup</code><br/><br/>
        Thumbs up a review. If the review is already
        thumbs up, undo the thumbs up.
        <br/><br/>
        Also undo any thumbs down.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ reviewId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the reviewId is invalid</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/review/thumbsdown</code><br/><br/>
        Thumbs down a review. If the review is already
        thumbs down, undo the thumbs down.
        <br/><br/>
        Also undo any thumbs up.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ reviewId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the reviewId is invalid</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/review/edit</code><br/><br/>
        Edits a review
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ reviewId, rating, reviewString }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the reviewId is invalid</li>
            <li>the rating is not strictly positive (rating <= 0)</li>
        </ul>
        </ul>
        Throw error with code 403 if none of the following are true:
        <ul>
            <li>the review does not belong to the auth user</li>
            <li>the auth user is not an admin</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/review/remove</code><br/><br/>
        Removes a review
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{ reviewId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the reviewId is invalid</li>
        </ul>
        Throw error with code 403 if none of the following are true:
        <ul>
            <li>the review does not belong to the auth user</li>
            <li>the auth user is not an admin</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/search/suggestion</code><br/><br/>
        Search for movies where either the title or description matches the search string and return an array of string titles.
        Return only the first 10 results.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{ searchString }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ titles }</code>
    </td>
    <td>
        N/A
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/list</code><br/><br/>
        Returns all movies that matches specific criteria from the start index to start + 10, and return the new end index. If the last movie has been returned, the value of end will be -1.
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
        <code>/user/unblock</code><br/><br/>
        Unblocks the given user.
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
            <li>the user is not initially blocked</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/profile</code><br/><br/>
        Returns the profile of a user
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameter</b><br/>
        <code>{uId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{user}</code>
    </td>
    <td>
        Throw error with code 403 if 
        <ul>
            <li>the given uId belongs to a user that has been blocked by the authUser</li>
            <li>the targetted user has status "Private"</li>
            <li>the targetted user has status "Friends" and the auth user is not a friend (sprint 3)</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/profile/update</code><br/><br/>
        Updates the profile of a user. If the password is empty, then leave the password the same (don't update).
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameter</b><br/>
        <code>{username, description, oldPassword, newPassword, age, gender}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>the password is less than 6 characters</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/user/profile/status</code><br/><br/>
        Updates the status of the user's profile to one of "public", "Friends" or "private"
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameter</b><br/>
        <code>{ userStatus }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>status is not "public", "friends" or "private"</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/details</code><br/><br/>
        Return all details about a movie
    </td>
    <td>
        GET
    </td>
    <td>
        <b>QUERY Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{movie}</code>
    </td>
    <td>
        TODO
    </td>
  </tr>

  <tr>
    <td>
        <code>/movie/random</code><br/><br/>
        Gets a random movie id
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ movieId }</code>
    </td>
    <td>
        N/A
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
        <code>{ userImage }</code>
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
        Gets recommendations about the given movie
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token</code><br/><br/>
        <b>Body Parameters (form</b><br/>
        <code>{ movieId }</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ movies }</code>
    </td>
    <td>
        Throw error with code 400 if:
        <ul>
            <li>The image is not a JPG/JPEG/PNG</li>
            <li>The image is over 2MB</li>
        </ul>
    </td>
  </tr>
</table>

#### Note:

Change token to be in headers
