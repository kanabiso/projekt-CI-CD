package com.movie.restApi.configuration

import com.movie.restApi.service.JWTService
import com.movie.restApi.service.MyUserDetailsService
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.ApplicationContext
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException


@Component
class JwtFilter(
    private val jwtService: JWTService,
    var context: ApplicationContext

) : OncePerRequestFilter() {

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        var token: String? = null
        var login: String? = null

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7)
            login = jwtService.extractLogin(token)
        }
        if (login != null && SecurityContextHolder.getContext().authentication == null) {
            val userDetails = context.getBean(MyUserDetailsService::class.java).loadUserByUsername(login)

            if (jwtService.validateToken(token!!, userDetails)) {
                val roles = jwtService.extractRoles(token) // Wyodrębnij role z tokenu

                val authorities = roles.stream()
                    .map { role: String? -> SimpleGrantedAuthority(role) }
                    .toList()
                val authToken =
                    UsernamePasswordAuthenticationToken(userDetails, null, authorities)
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        }
        filterChain.doFilter(request, response)
    }
}
