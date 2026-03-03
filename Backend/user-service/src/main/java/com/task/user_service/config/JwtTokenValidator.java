package com.task.user_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();

        // ONLY skip the filter for public/auth endpoints
        // PROTECT everything under /api/ (including /api/user/profile)
        return path.startsWith("/auth/") ||
                path.equals("/login") ||
                path.equals("/signup") ||
                path.startsWith("/public/") ||
                path.contains("h2-console");   // optional
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader(JwtConstatnt.JWT_HEADER);
        if(jwt!=null){
            jwt=jwt.substring(7);

            try{
                SecretKey key = Keys.hmacShaKeyFor(JwtConstatnt.SECRET_KEY.getBytes());
                Claims claims =Jwts.parser().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

                String email=String.valueOf(claims.get("email"));
                String authorities=String.valueOf(claims.get("authorities"));

                List<GrantedAuthority> auth= AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
                Authentication authentication = new UsernamePasswordAuthenticationToken(email,null,auth);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch(Exception e){
                throw new BadCredentialsException("Invalid token..");
            }
        }
        filterChain.doFilter(request, response);

    }

}
