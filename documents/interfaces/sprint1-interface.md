# Capstone Project COMP3900 F16A - Impregnable

## Interface

### Data Types

| Variable Name | Type |
| --- | --- |
| contains prefix **num** | `number`, specifically integer |
| contains suffix **String** | `string` |
| contains suffix **Id** | `string` |
| contains substring **name** | `string` |
| is exactly **genre** | `string` |
| is exactly **sortBy** | `string`: 'name' \| 'rating' |
| is exactly **director** | `string` |
| is exactly **token** | `string` |
| is exactly **user** | Object containing keys `{uId, username, email, isAdmin, image, wishList, watchList, favouriteList}` |
| is exactly **users** | Array of objects, where each object has the keys `{uId, username, image, isAdmin}` |
| is exactly **fullTitle** | `string` |
| is exactly **description** | `string` |
| is exactly **image** | `string` (url link) |
| is exactly **releaseDate** | `string` |
| contains substring **rating** | `number`, specifically float |
| is exactly **directorList** | Array of objects, where each objects contain the keys `{id, name}` |
| is exactly **asCharacter** | `string` |
| is exactly **actorList** | Array of objects, where each objects contain the keys `{id, image, name, asCharacter}` |
| is exactly **genreList** | `Array<string>`. |
| is exactly **reviews** | Array of objects, where each objects contain the keys `{reviewerId, reviewString, numThumbsUp, numThumbsDown}` |
| is exactly **movie** | Object containing keys `{movieId, fullTitle, description, isWish, isWatched, isFavourite, image, releaseDate, rating, imdbRating, directorList, actorList, genreList, reviews}` |
| is exactly **movies** | Array of objects, where each object contains the keys `{movieId, fullTitle, image, rating }`|
| contains suffix **List** | `movies`  |

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
        <code>/auth/register</code><br/><br/>
        Registers a new user logs the user in.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{username, email, password}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{token, uId}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>email is invalid</li>
            <li>email is already taken</li>
            <li>password is less than 6 characters</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/auth/login</code><br/><br/>
        Logs a user in.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{email, password}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{token, uId}</code>
    </td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
        <code>/auth/logout</code><br/><br/>
        Logs a user out of their current session.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/auth/logout/all</code><br/><br/>
        Logs a user out of all active sessions.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 403 if the token is invalid.
    </td>
  </tr>
  <tr>
    <td>
        <code>/admin/movie/add</code><br/><br/>
        Adds a movie to the database.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{imdbId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{ movieId }</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>the movie already exists </li>
            <li>the imdbId is invalid</li>
        </ul>
        Return code 403 if:
        <ul>
            <li>auth user is not an admin </li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/admin/movie/update</code><br/><br/>
        Updates a movie in the database.
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId, genreList, fullTitle, description}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>the movieId is invalid</li>
        </ul>
        Return code 403 if:
        <ul>
            <li>auth user is not an admin</li>
        </ul>
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
        <b>Query Parameters</b><br/>
        <code>{keyword, genre, director, sortBy, start}</code>
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
        <code>/user/profile</code><br/><br/>
        Returns the profile of a user
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameter</b><br/>
        <code>{uId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{user}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/users/all</code><br/><br/>
        Return brief details about all users
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Return Object</b><br/>
        <code>{users}</code>
    </td>
    <td>
        N/A
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
        <code>/user/watchedlist/add</code><br/><br/>
        Add a movie to the user's watched list 
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/user/wishlist/add</code><br/><br/>
        Add a movie to the user's wishlist 
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/user/favouritelist/add</code><br/><br/>
        Add a movie to the user's favouritelist 
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Body Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/user/watchedlist/remove</code><br/><br/>
        Remove a movie from the user's watched list 
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
            <li>movie is not in the user's watched list</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/user/wishlist/remove</code><br/><br/>
        Remove a movie from the user's wish list 
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
            <li>movie is not in the user's wish list</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/user/favouritelist/remove</code><br/><br/>
        Remove a movie from the user's favourite list 
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Headers</b><br/>
        <code>{Authorization: token}</code>
        <br/><br/>
        <b>Query Parameters</b><br/>
        <code>{movieId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return code 400 if:
        <ul>
            <li>movie id is invalid</li>
            <li>movie is not in the user's favourite list</li>
        </ul>
    </td>
  </tr>
</table>


#### Invalid Token

For all routes above, if there is a token parameter and the supplied token argument is invalid, an error with code 401 is returned.

#### Note:

Change token to be in headers
