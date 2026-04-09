package com.movie.restApi.repository

import com.movie.restApi.model.User
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface UserRepository : MongoRepository<User, String> {
    fun findByLogin(login: String): User?
    fun findByEmail(email: String): User?
    override fun findById(email: String): Optional<User>
}