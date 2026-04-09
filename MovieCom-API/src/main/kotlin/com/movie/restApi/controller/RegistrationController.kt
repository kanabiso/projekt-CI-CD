package com.movie.restApi.controller

import com.movie.restApi.model.User
import com.movie.restApi.repository.UserRepository
import com.movie.restApi.service.AuthorizationService
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/register")
class RegistrationController(
    private val authService: AuthorizationService,
    private val userRepository: UserRepository
) {
    private val encoder = BCryptPasswordEncoder(10)

    @PostMapping
    fun register(@RequestBody user: User): ResponseEntity<Map<String, Any>> {
        if (userRepository.findByLogin(user.login) != null) {
            val response: MutableMap<String, Any> = HashMap()
            response["success"] = false
            response["message"] = "Login already exists"

            return ResponseEntity.status(409).body(response)
        }

        if (userRepository.findByEmail(user.email) != null) {
            val response: MutableMap<String, Any> = HashMap()
            response["success"] = false
            response["message"] = "Email already exists"

            return ResponseEntity.status(409).body(response)
        }

        user.password = encoder.encode(user.password)

        authService.register(user)
        val response: MutableMap<String, Any> = HashMap()
        response["success"] = true
        response["message"] = "Registered"
        return ResponseEntity.ok(response)
    }
}
