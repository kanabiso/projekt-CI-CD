package com.movie.restApi.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

//DTO: Kontroler, API

data class CommentDTO(
    val _id: String?,
    @field:NotEmpty(message = "Movie ID cannot be empty")
    val movieId: String,


    @field:NotEmpty(message = "User cannot be empty")
    val user: String,

    @field:NotEmpty(message = "Content cannot be empty")
    val content: String,

    @field:NotNull(message = "Rating cannot be null")
    @field:Min(value = 1, message = "Rating must be at least 1")
    @field:Max(value = 10, message = "Rating must be at most 10")
    val rating: Double?
)
