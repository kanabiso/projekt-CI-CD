package com.movie.restApi.mappers

import com.movie.restApi.dto.MovieDTO
import com.movie.restApi.model.Movie
import org.mapstruct.*
import org.mapstruct.factory.Mappers


@Mapper
interface MovieMapper {
    companion object {
        val INSTANCE: MovieMapper = Mappers.getMapper(MovieMapper::class.java)
    }

    fun toDTO(movie: Movie): MovieDTO

//    @Mapping(target = "id", ignore = true)
    fun toEntity(movieDTO: MovieDTO): Movie

    //sluzy do mapowania obiektu przy jego aktualizacji tak aby zaktualizowane zostały tylko te pola
    //ktore zostaly przekazane w body zapytania
//    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    fun updateMovieFromDTO(dto: MovieDTO, @MappingTarget movie: Movie)
}