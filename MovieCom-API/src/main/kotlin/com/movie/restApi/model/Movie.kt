package com.movie.restApi.model

import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDate
import java.util.*

@Document(collection = "movies")
data class Movie(
    @Id
    var _id: String? = null,
    var plot: String?,
    var genres: List<String>?,
    var runtime: Int? = null,
    var cast: List<String> = mutableListOf(),
    @Field("num_mflix_comments")
    var numMflixComments: Int? = null,
    var poster: String?,
    var title: String,
    var fullplot: String?,
    var languages: List<String> = mutableListOf(),
    var released: LocalDate?,
    var directors: List<String> = mutableListOf(),
    var writers: List<String> = mutableListOf(),
    var awards: Awards?,
    @LastModifiedDate
    var lastUpdated: LocalDate? = null,
    var year: Int? = null,
    var imdb: Imdb? = null,
    var countries: List<String> = mutableListOf(),
    var type: String?,
    var tomatoes: Tomatoes? = null
) {
    data class Awards(
        var wins: Int? = 0,
        var nominations: Int? = 0,
        var text: String? = ""
    )

    data class Imdb(
        var rating: Double? = 0.0,
        var votes: Int? = 0,
        var id: Int? = 0
    )

    data class Tomatoes(
        var viewer: Viewer? = Viewer(),
        var website: String? = "",
        var production: String? = "",
        var lastUpdated: Date? = Date(),
        var dvd: Date? = Date()
    ) {
        data class Viewer(
            var rating: Double? = 0.0,
            var numReviews: Double? = 0.0,
            var meter: Int? = 0
        )
    }
}



