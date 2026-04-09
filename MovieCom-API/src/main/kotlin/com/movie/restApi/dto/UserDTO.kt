package com.movie.restApi.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

data class UserDTO(
    @field:NotBlank(message = "Login cannot be empty")
    val login: String,

    @field:NotBlank(message = "Email cannot be empty")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password cannot be empty")
    @field:Size(min = 6, message = "Password must be at least 6 characters long")
    val password: String,

    @field:NotEmpty
    val role: List<String>
)
