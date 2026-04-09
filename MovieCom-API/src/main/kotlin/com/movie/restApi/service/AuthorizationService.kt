package com.movie.restApi.service

import com.movie.restApi.dto.UserLoginDTO
import com.movie.restApi.model.User
import com.movie.restApi.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service

@Service
class AuthorizationService @Autowired constructor(
    private val userRepository: UserRepository,
    private val jwtService: JWTService,
    private val authManager: AuthenticationManager
) {

    fun register(user: User): User {
        return userRepository.save(user)
    }

    fun verify(user: UserLoginDTO): String {
        val authentication: Authentication = authManager.authenticate(
            UsernamePasswordAuthenticationToken(user.login, user.password)
        )
        return if (authentication.isAuthenticated) {
            jwtService.generateToken(user)
        } else {
            "Fail"
        }
    }
}

