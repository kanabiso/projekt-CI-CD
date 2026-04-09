package com.movie.restApi.controller

import com.mongodb.DuplicateKeyException
import com.movie.restApi.dto.UserDTO
import com.movie.restApi.mappers.UserMapper
import com.movie.restApi.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService
) {
    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserDTO>> {
        val users = userService.getAllUsers()
        if (!users.isNullOrEmpty()) {
            val usersDTO = users.map { user -> UserMapper.INSTANCE.toDTO(user) }
            return ResponseEntity(usersDTO, HttpStatus.OK)
        } else {
            return ResponseEntity(emptyList(), HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: String): ResponseEntity<Any> {
        val user = userService.getUserById(id)
        if (user.isPresent) {
            val userDTO = UserMapper.INSTANCE.toDTO(user.get())
            return ResponseEntity(userDTO, HttpStatus.OK)
        } else {
            return ResponseEntity("User with id: $id not found", HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/login/{login}")
    fun getUserByLogin(@PathVariable login: String): ResponseEntity<Any> {
        return userService.getUserByLogin(login)?.let { user ->
            val userDTO = UserMapper.INSTANCE.toDTO(user)
            ResponseEntity(userDTO, HttpStatus.OK)
        } ?: ResponseEntity("User with login: $login not found", HttpStatus.OK)
    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    fun createUser(@Valid @RequestBody userDTO: UserDTO, bindingResult: BindingResult): ResponseEntity<Any> {
        if (bindingResult.hasErrors()) {
            val errorMessage = bindingResult.allErrors.joinToString(", ") { it.defaultMessage ?: "Invalid data" }
            return ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST)
        }
        try {
            val newUser = userService.createUser(
                UserMapper.INSTANCE.toEntity(userDTO)
            )
            return if (newUser != null) {
                ResponseEntity(newUser, HttpStatus.CREATED)
            } else {
                ResponseEntity("Some went wrong creating user", HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } catch (e: DuplicateKeyException) {
            return ResponseEntity("Login or email already exist in database", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateUser(@PathVariable id: String, @Valid @RequestBody userDetails: UserDTO): ResponseEntity<Any> {
        val existingUser = userService.getUserById(id)

        if (existingUser.isPresent) {
            val oldUser = existingUser.get()
            oldUser.login = userDetails.login
            oldUser.email = userDetails.email
            oldUser.role = userDetails.role

            val updatedUser = userService.updateUser(id, oldUser)
            val updatedUserDTO = UserMapper.INSTANCE.toDTO(updatedUser!!)
            return ResponseEntity(updatedUserDTO, HttpStatus.OK)
        } else {
            return ResponseEntity("User with id $id not found", HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteUser(@PathVariable id: String): ResponseEntity<String> {
        return if (userService.deleteUser(id)) {
            ResponseEntity("User deleted successfully", HttpStatus.OK)
        } else {
            ResponseEntity("User with id: $id not found", HttpStatus.NOT_FOUND)
        }
    }
}