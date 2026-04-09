package com.movie.restApi.model

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*


//Model: Serwis, repozytorium

@Document(collection = "comments")
data class Comment(
    @Id // MongoDB automatycznie generuje ID
    val _id: String? = null,
    var movieId: String,
    var user: String,

    @CreatedDate // Automatyczna data utworzenia (wymaga @EnableMongoAuditing)
    val createdAt: Date? = null,
    var content: String,
    var rating: Double
)