FROM mongo:7.0
COPY movies.json /movies.json
COPY users.json /users.json
COPY --chmod=755 import.sh /docker-entrypoint-initdb.d/import.sh
