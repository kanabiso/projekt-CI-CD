package com.movie.restApi.controller

import com.movie.restApi.dto.CommentDTO
import com.movie.restApi.dto.CommentUpdateDTO
import com.movie.restApi.mappers.CommentMapper
import com.movie.restApi.model.Comment
import com.movie.restApi.service.CommentService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/comments")
class CommentController(
    private val commentService: CommentService
) {
    @GetMapping
    fun getAllComments(): ResponseEntity<List<CommentDTO>> {
        val comments: List<Comment> = commentService.getAllComments()
        return commentsRespond(comments)
    }

    @GetMapping("login/{login}")
    fun getCommentsByUser(@PathVariable login: String): ResponseEntity<List<CommentDTO>> {
        val comments = commentService.getCommentByUser(login)
        return commentsRespond(comments)
    }

    @GetMapping("movieID/{movieID}")
    fun getCommentsByMovieId(@PathVariable movieID: String): ResponseEntity<List<CommentDTO>> {
        val comments = commentService.getCommentByMovieId(movieID)
        return commentsRespond(comments)
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    fun createComment(@RequestBody @Valid commentDTO: CommentDTO, bindingResult: BindingResult): ResponseEntity<Any> {
        //obsluga bledow z validatora dto
        if (bindingResult.hasErrors()) {
            val errorMessage = bindingResult.allErrors.joinToString(", ") { it.defaultMessage ?: "Invalid data" }
            return ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST)
        }
        val newComment = commentService.createComment(
            CommentMapper.INSTANCE.toEntity(commentDTO)
        )

        return if (newComment != null) {
            ResponseEntity(newComment, HttpStatus.CREATED)
        } else {
            ResponseEntity("Not able to create comment!", HttpStatus.CONFLICT)
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateComment(
        @PathVariable id: String,
        @Valid @RequestBody commentDetails: CommentUpdateDTO
    ): ResponseEntity<Any> {
        //Client can edit only content and rating, other changes will not be saved in the database
        val existingComment = commentService.getCommentById(id)

        if (existingComment.isPresent) {
            val oldComment = existingComment.get()
            oldComment.content = commentDetails.content
            oldComment.rating = commentDetails.rating

            val updatedComment = commentService.updateComment(id, oldComment)
            val updatedCommentDTO = CommentMapper.INSTANCE.toDTO(updatedComment.get())
            return ResponseEntity(updatedCommentDTO, HttpStatus.OK)
        } else {
            return ResponseEntity("Comment with id $id not found", HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteComment(@PathVariable id: String): ResponseEntity<String> {
        return if (commentService.deleteComment(id)) {
            ResponseEntity("Comment deleted successfully", HttpStatus.OK)
        } else {
            ResponseEntity("Comment with id: $id not found", HttpStatus.NOT_FOUND)
        }
    }

    private fun commentsRespond(comments: List<Comment>): ResponseEntity<List<CommentDTO>> {
        return if (!comments.isNullOrEmpty()) {
            val commentsDTO = comments.map { comment -> CommentMapper.INSTANCE.toDTO(comment) }
            ResponseEntity(commentsDTO, HttpStatus.OK)
        } else {
            ResponseEntity(emptyList(), HttpStatus.NOT_FOUND)
        }
    }
}

