package com.movie.restApi.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection  = "users")
data class User(
    @Id
    val id: String? = null,
    @Indexed(unique = true)
    var login: String,
    @Indexed(unique = true)
    var email: String,
    var password: String,
    var role: List<String> = listOf("ROLE_USER")
)