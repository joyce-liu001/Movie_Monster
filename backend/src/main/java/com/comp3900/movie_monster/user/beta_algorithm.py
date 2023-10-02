import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import numpy as np
import pandas as pd
import os
import sys

# TODO: FIX this
DATA_PATH = " /Users/damon/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/93131244483c37876d82dc8b5bbf1306/Message/MessageTemp/d0b535b1a2c5c30ebbe92787e2e6b79a/File/Movie.json"


def algorithm(uid):
    # connect to mongoDB
    DATABASE = os.getenv(
        "DATABASE_URI", "mongodb://localhost:27017/")
    myclient = MongoClient(DATABASE)
    mydb = myclient['3900project']
    users = mydb['User']
    movies = mydb['Movie']
    query = {'_id': uid}
    user = users.find_one(query)
    # 2. get the watched list
    watched_list = [movie['description'] for movie in user['watchedList']]
    watched_list_id = [movie['_id'] for movie in user['watchedList']]
    # 3. get the movie list
    pd_movies = pd.DataFrame(movies.find())
    pd_movies = pd_movies[~pd_movies._id.isin(watched_list_id)]
    # 4. do algorithm
    vectorizer = TfidfVectorizer()
    vectorizer.fit(pd_movies['description'])

    doc_movies = vectorizer.transform(pd_movies['description'])
    doc_watched_list = vectorizer.transform(watched_list)

    similarity_matrix = cosine_similarity(doc_movies, doc_watched_list)
    average = np.average(similarity_matrix, axis=0)[0]

    related_movies = pd_movies[np.amax(similarity_matrix, axis=1) > average]
    related_movies = related_movies.sort_values(
        by=['imdbRating'], ascending=False)

    # result = dict()
    result = ""
    for _, related_movie in related_movies.head(10).iterrows():
        # inner_result = dict()
        # inner_result['movieId'] = related_movie['_id']
        # inner_result['fullTitle'] = related_movie['fullTitle']
        # inner_result['image'] = related_movie['image']
        # inner_result['rating'] = related_movie['imdbRating']
        # result['movies'].append(inner_result)
        result = result + related_movie['_id'] + ","
    print(result)


if __name__ == "__main__":
    uid = sys.argv[1]
    algorithm(uid)
