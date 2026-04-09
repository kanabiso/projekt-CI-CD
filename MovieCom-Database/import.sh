#!/bin/bash
mongoimport --uri="mongodb://localhost:27017/moviecom" --collection="movies" --type=json --file="/movies.json" --jsonArray
mongoimport --uri="mongodb://localhost:27017/moviecom" --collection="users" --type=json --file="/users.json" --jsonArray
