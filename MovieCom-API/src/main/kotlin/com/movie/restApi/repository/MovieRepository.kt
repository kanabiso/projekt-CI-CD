package com.movie.restApi.repository

import com.movie.restApi.model.Movie
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import java.util.*

interface MovieRepository : MongoRepository<Movie, String> {
    fun findByTitleContainingIgnoreCase(title: String): List<Movie>
    override fun findById(id: String): Optional<Movie>
    @Query("{ 'title': { \$regex: ?0, \$options: 'i' } }")
    fun findByTitleRegex(title: String, pageable: Pageable): Page<Movie>
}