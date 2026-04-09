package com.movie.restApi.controller

import com.movie.restApi.dto.MovieDTO
import com.movie.restApi.mappers.MovieMapper
import com.movie.restApi.service.MovieService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/movies")
class MovieController(
    private val movieService: MovieService,
) {
    @GetMapping()
    fun getAllMovies(): ResponseEntity<List<MovieDTO>> {
        val movies = movieService.getAllMovies()
        if (movies.isNotEmpty()) {
            val moviesDTO = movies.map { MovieMapper.INSTANCE.toDTO(it) }
            return ResponseEntity(moviesDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(emptyList(), HttpStatus.OK)
        }
    }

    @GetMapping("/id/{id}")
    fun getMovieById(@PathVariable id: String): ResponseEntity<MovieDTO> {
        val movie = movieService.getMovieById(id)
        if (movie.isPresent) {
            val movieDTO = MovieMapper.INSTANCE.toDTO(movie.get())
            return ResponseEntity(movieDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(null, HttpStatus.OK)
        }
    }

    @GetMapping("/title/{title}")
    fun getMovieByTitle(@PathVariable title: String): ResponseEntity<List<MovieDTO>> {
        val movie = movieService.getMoviesByTitle(title)
        if (movie.isNotEmpty()) {
            val moviesDTO = movie.map { MovieMapper.INSTANCE.toDTO(it) }
            return ResponseEntity(moviesDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(emptyList(), HttpStatus.OK)
        }
    }

    @GetMapping("/limit")
    fun getMoviesWithLimit(
        @RequestParam(value = "title") title: String,
        @RequestParam(value = "pageNumber", defaultValue = "0") pageNumber: Int,
        @RequestParam(value = "pageSize", defaultValue = "6") pageSize: Int
    ): ResponseEntity<List<MovieDTO>> {
        val movies = movieService.getMoviesByTitleWithLimit(title, pageNumber, pageSize)
        if (movies.isNotEmpty()) {
            val moviesDTO = movies.map { MovieMapper.INSTANCE.toDTO(it) }
            return ResponseEntity(moviesDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(emptyList(), HttpStatus.OK)
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createMovie(@RequestBody movie: MovieDTO): ResponseEntity<MovieDTO> {
        val newMovie = movieService.createMovie(MovieMapper.INSTANCE.toEntity(movie))
        return ResponseEntity(MovieMapper.INSTANCE.toDTO(newMovie), HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateMovie(@PathVariable id: String, @RequestBody movieDTO: MovieDTO): ResponseEntity<MovieDTO> {
        val existingMovieOptional = movieService.getMovieById(id)
        if (!existingMovieOptional.isPresent) {
            return ResponseEntity(null, HttpStatus.NOT_FOUND)
        }

        val existingMovie = existingMovieOptional.get()

        MovieMapper.INSTANCE.updateMovieFromDTO(movieDTO, existingMovie)

        val updatedMovie = movieService.updateMovie(id, existingMovie)
        if (updatedMovie.isPresent) {
            val updatedMovieDTO = MovieMapper.INSTANCE.toDTO(updatedMovie.get())
            return ResponseEntity.ok(updatedMovieDTO)
        }

        return ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun deleteMovie(@PathVariable id: String): ResponseEntity<String> {
        return if (movieService.deleteMovie(id)) {
            ResponseEntity("Movie deleted successfully", HttpStatus.OK)
        } else {
            ResponseEntity("Movie with id: $id not found", HttpStatus.OK)
        }
    }
}