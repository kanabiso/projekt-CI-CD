package com.movie.restApi.service

import com.movie.restApi.model.Movie
import com.movie.restApi.repository.MovieRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import java.util.*

@Service
class MovieService(
    private val movieRepository: MovieRepository
) {
    fun getAllMovies(): List<Movie> = movieRepository.findAll()

    fun getMovieById(id: String): Optional<Movie> = movieRepository.findById(id)

    fun getMoviesByTitle(title: String): List<Movie> = movieRepository.findByTitleContainingIgnoreCase(title)

    fun getMoviesByTitleWithLimit(title: String, pageNumber: Int, pageSize: Int): List<Movie> {
        val pageable: Pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "year"))
        // Regex with pagination
        val resultPage: Page<Movie> = movieRepository.findByTitleRegex(title, pageable)

        return resultPage.content
    }

    fun createMovie(movie: Movie): Movie = movieRepository.save(movie)

    fun updateMovie(id: String, movie: Movie): Optional<Movie> {
        return if (movieRepository.existsById(id)) {
            movie._id = id
            Optional.of(movieRepository.save(movie))
        } else {
            Optional.empty()
        }
    }

    fun deleteMovie(id: String): Boolean {
        return if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}