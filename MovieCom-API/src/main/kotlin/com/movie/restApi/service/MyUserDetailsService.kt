package com.movie.restApi.service

import com.movie.restApi.repository.UserRepository
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class MyUserDetailsService(
    private val userRepository: UserRepository // Wstrzyknięcie zależności za pomocą konstruktora
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByLogin(username)
        if (user == null) {
            println("User not found")
            throw UsernameNotFoundException("user not found")
        }
        println("Znaleziono użytkownika: ${user.login}")

        val authorities: List<GrantedAuthority> = user.role.map { role ->
            SimpleGrantedAuthority("ROLE"+role)
        }
        return org.springframework.security.core.userdetails.User(
            user.login,
            user.password,
            authorities
        )
    }
}