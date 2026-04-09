package com.movie.restApi.service

import com.movie.restApi.model.User
import com.movie.restApi.repository.UserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun getAllUsers(): List<User>? = userRepository.findAll()

    fun getUserById(id: String): Optional<User> = userRepository.findById(id)

    fun getUserByLogin(login: String): User? = userRepository.findByLogin(login)

    fun createUser(user: User): User? = userRepository.save(user)

    fun updateUser(id: String, userDetails: User): User? {
        val userOptional = userRepository.findById(id)
        if (userOptional.isPresent) {
            val user = userOptional.get()
            user.login = userDetails.login
            user.password = userDetails.password
            user.email = userDetails.email
            user.role = userDetails.role
            return userRepository.save(user)
        }
        return null
    }

    fun deleteUser(id: String): Boolean {
        val userOptional = userRepository.findById(id)
        if (userOptional.isPresent) {
            userRepository.deleteById(id)
            return true
        }
        return false
    }

}
