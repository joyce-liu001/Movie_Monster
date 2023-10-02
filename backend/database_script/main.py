import json
from pymongo import MongoClient
from alive_progress import alive_it
import os

# E.g. mongodb+srv://movie-monster:movie-monster-pass@movie-monster-backend.p9imp.mongodb.net
# database_uri = os.getenv('DATABASE_URI', 'mongodb+srv://movie-monster:movie-monster-pass@movie-monster-backend.p9imp.mongodb.net')
database_uri = os.getenv('DATABASE_URI', 'mongodb://localhost:27017')

mongo_client = MongoClient(database_uri)

mongo_client.drop_database('3900project')

db = mongo_client['3900project']

collections = ['Actor', 'Director', 'Movie', 'Review', 'Test', 'User', 'Blog', 'Request', 'Quiz']
datas = []

bar = alive_it(collections, bar='blocks', spinner='waves', title="Loading data from local storage ...")

for collection in bar:

    filename = collection + '.json'
    print(filename)
    with open(filename, encoding = 'utf8') as f:
        print(f)
        datas.append(json.load(f))
print("Data loaded successfully!")

bar = alive_it(datas, bar='blocks', spinner='waves', title="Pushing data to MongoDB ...")
i = 0
for data in bar:
    if data:
        db[collections[i]].insert_many(data)
    i += 1
print("Data pushed successfully!")
