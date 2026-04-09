# MovieCom

## Project Description

MovieCom is an application designed to manage data related to movies, users, and comments. The application utilizes a RESTful architecture, allowing for easy and efficient interactions with data through standard HTTP methods.

Frontend client available in repository: [MovieCom-Client](https://github.com/bartosz-kanadys/MovieCom-Client)

## Features

- **Movie Management**: Ability to add, edit, delete, and view movies.
- **User  Management**: Registration, login, and management of user data.
- **Comment Management**: Users can add, edit, and delete comments on movies.
- **Spring Security**: The application employs Spring Security to manage access to resources.
- **Authorization**: Utilizes JWT (JSON Web Token) for user authorization.
- **User  Roles**: Users can have different roles, such as user and administrator.

## Technologies

- **Programming Language**: Kotlin
- **Framework**: Spring Boot
- **Database**: MongoDB
- **Mapping**: MapStruct
- **Spring Security**: Utilizes Spring Security for access management.
- **JWT**: Uses JWT for user authorization.

### Authorization
- `POST /login` - to login
- `POST /register` - to registration

### Movies

- `GET /movies` - Retrieve all movies
- `GET /movies/id/{id}` - Retrieve a movie by ID
- `GET /movies/title/{title}` - Retrieve a movie by title
- `GET /movies/limit?title=Shrek&pageNumber=0&pageSize=6` - Retrieve movies by title using pageable mechanism
- `POST /movies` - Add a new movie (accessible to users with the administrator role)
- `PUT /movies/{id}` - Update a movie (accessible to users with the administrator role)
- `DELETE /movies/{id}` - Delete a movie (accessible to users with the administrator role)

### Users

- `GET /users` - Retrieve all users
- `GET /users/{id}` - Retrieve a user by ID
- `GET /users/login/{login}` - Retrieve a user by login
- `POST /users` - Register a new user
- `PUT /users/{id}` - Update a user (accessible to users with the administrator role)
- `DELETE /users/{id}` - Delete a user (accessible to users with the administrator role)

### Comments

- `GET /comments` - Retrieve all comments
- `GET /comments/login/{login}` - Retrieve comments by user
- `GET /comments/movieId/{movieId}` - Retrieve comments by movie id
- `POST /comments` - Add a new comment (only logged in users)
- `PUT /comments/{id}` - Update a comment (accessible to users with the moderator or administrator role)
- `DELETE /comments/{id}` - Delete a comment (accessible to users with the moderator or administrator role)
