package com.movie.restApi.dto

import java.time.LocalDate
import java.util.*

data class MovieDTO(
    val _id: String?,
    val plot: String?,
    val genres: List<String>?,
    val runtime: Int?,
    val cast: List<String> = mutableListOf(),
    val numMflixComments: Int?,
    val poster: String?,
    val title: String?,
    val fullplot: String?,
    val languages: List<String> = mutableListOf(),
    val released: LocalDate?,
    val directors: List<String> = mutableListOf(),
    val writers: List<String> = mutableListOf(),
    val awards: Awards?,
    val lastUpdated: LocalDate?,
    val year: Int?,
    val imdb: Imdb?,
    val countries: List<String> = mutableListOf(),
    val type: String?,
    val tomatoes: Tomatoes?,
) {
    data class Awards(
        val wins: Int?,
        val nominations: Int?,
        val text: String?
    )

    data class Imdb(
        val rating: Double?,
        val votes: Int?,
        val id: Int?
    )

    data class Tomatoes(
        val viewer: Viewer?,
        val website: String?,
        val production: String?,
        val lastUpdated: Date?,
        val dvd: Date?
    ) {
        data class Viewer(
            val rating: Double?,
            val numReviews: Double?,
            val meter: Int?
        )
    }
}