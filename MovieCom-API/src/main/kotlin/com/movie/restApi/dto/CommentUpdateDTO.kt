package com.movie.restApi.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

data class CommentUpdateDTO(
    @get:NotEmpty(message = "Content cannot be empty")
    var content: String,

    @get:NotNull(message = "Rating cannot be null")
    @get:Min(value = 1, message = "Rating must be at least 1")
    @get:Max(value = 10, message = "Rating must be at most 10")
    var rating: Double
)