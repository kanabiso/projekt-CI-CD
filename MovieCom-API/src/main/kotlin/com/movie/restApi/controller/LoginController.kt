package com.movie.restApi.controller

import com.movie.restApi.dto.UserLoginDTO
import com.movie.restApi.service.AuthorizationService
import com.movie.restApi.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class LoginController(
    private val authService: AuthorizationService,
    private val userService: UserService
) {
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    fun login(@RequestBody user: UserLoginDTO): ResponseEntity<Map<String, Any>> {
        val response: MutableMap<String, Any> = HashMap()

        if (authService.verify(user) != "Fail") {
            response["status"] = 200
            response["success"] = true
            response["message"] = "login success"
            response["login"] = user.login
            response["token"] = authService.verify(user)
            return ResponseEntity.ok(response)
        } else {
            response["status"] = 404
            response["success"] = false
            response["message"] = "Login failed"
            return ResponseEntity.status(404).body(response)
        }
    }
}
