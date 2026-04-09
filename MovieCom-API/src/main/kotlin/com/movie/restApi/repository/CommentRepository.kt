package com.movie.restApi.repository

import com.movie.restApi.model.Comment
import org.springframework.data.mongodb.repository.MongoRepository

interface CommentRepository : MongoRepository<Comment, String> {
    fun findByUser(user: String): List<Comment>
    fun findByMovieId(id: String): List<Comment>
}