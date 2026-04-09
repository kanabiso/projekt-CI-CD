package com.movie.restApi.mappers

import com.movie.restApi.dto.CommentDTO
import com.movie.restApi.model.Comment

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers

/**
 * Klasa do mapowania MODEL <-> DTO za pomoca biblioteki mapstruct
 */

@Mapper
interface CommentMapper {

    //statyczna instacja mappera
    companion object {
        val INSTANCE: CommentMapper = Mappers.getMapper(CommentMapper::class.java)
    }

    //ignorowane pola Mongo samo je wstawia
//    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    fun toEntity(dto: CommentDTO): Comment

    fun toDTO(comment: Comment): CommentDTO
}