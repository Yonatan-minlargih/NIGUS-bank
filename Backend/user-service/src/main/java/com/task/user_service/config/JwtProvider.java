package com.task.user_service.config;

import com.task.user_service.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class JwtProvider {

    private static final SecretKey key = Keys.hmacShaKeyFor(JwtConstatnt.SECRET_KEY.getBytes());

    public static String generateToken(Authentication auth, Long userId){
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        String roles=populateAuthorities(authorities);

        String jwt = Jwts.builder()
                .setSubject(userId.toString())           // ← ADD THIS LINE (important!)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000))
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
        return jwt;
    }

    public static String getEmailFromJwtToken(String jwt){
        jwt=jwt.substring(7);
        Claims claims = Jwts.parser().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
        String email =String.valueOf(claims.get("email"));
        return email;
    }

    public static String populateAuthorities(Collection<? extends GrantedAuthority> collection){
        Set<String> auth= new HashSet<>();

        for(GrantedAuthority authority:collection){
            auth.add(authority.getAuthority());
        }
        return String.join(",",auth);
    }


}
