package com.movie.restApi.service

import com.movie.restApi.model.Comment
import com.movie.restApi.repository.CommentRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class CommentService(
    private val commentRepository: CommentRepository
) {
    fun getAllComments(): List<Comment> = commentRepository.findAll()

    fun getCommentByUser(userName: String): List<Comment> = commentRepository.findByUser(userName)

    fun getCommentByMovieId(id: String): List<Comment> = commentRepository.findByMovieId(id)

    fun getCommentById(id: String): Optional<Comment> = commentRepository.findById(id)

    fun createComment(comment: Comment): Comment? = commentRepository.save(comment)

    fun updateComment(id: String, commentDetails: Comment): Optional<Comment> {
        val commentOptional = commentRepository.findById(id)
        return if (commentOptional.isPresent) {
            val comment = commentOptional.get()
            comment.user = commentDetails.user
            comment.movieId = commentDetails.movieId
            comment.content = commentDetails.content
            Optional.of(commentRepository.save(comment))
        } else {
            Optional.empty<Comment>()
        }
    }

    fun deleteComment(id: String): Boolean {
        return if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}