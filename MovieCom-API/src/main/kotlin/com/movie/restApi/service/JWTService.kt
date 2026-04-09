package com.movie.restApi.service

import com.movie.restApi.dto.UserLoginDTO
import com.movie.restApi.model.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class JWTService @Autowired constructor(
    private val userService: UserService, // Konstruktor w Kotlinie, zamiast @Autowired w polach
    @Value("\${jwt.secret}") private val secretKey: String // Wstrzyknięcie secretKey
) {

    fun generateToken(user: UserLoginDTO): String {
        val userFromDatabase = userService.getUserByLogin(user.login)
        println(userFromDatabase)
        println(user.login)

        val header: Map<String, Any> = mapOf(
            "typ" to "JWT",
            "alg" to "HS256"
        )

        val claims: MutableMap<String, Any> = HashMap()

        claims["login"] = user.login
        if (userFromDatabase != null) {
            claims["email"] = userFromDatabase.email
        }
        if (userFromDatabase != null) {
            claims["role"] = userFromDatabase.role
        }

        return Jwts.builder()
            .setHeaderParams(header)
            .setClaims(claims)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Godzina ważności tokenu
            .signWith(getKey())
            .compact()
    }

    private fun getKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(secretKey)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    fun extractLogin(token: String): String {
        return extractClaim(token) { claims -> claims["login"] as String }
    }

    fun extractRoles(token: String): List<String> {
        return extractClaim(token) { claims -> claims["role"] as List<String> }
    }

    private fun <T> extractClaim(token: String, claimResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimResolver(claims)
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .body
    }

    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        val userName = extractLogin(token)
        return userName == userDetails.username && !isTokenExpired(token)
    }

    fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { claims -> claims.expiration }
    }
}
