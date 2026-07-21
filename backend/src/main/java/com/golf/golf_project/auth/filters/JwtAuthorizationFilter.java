package com.golf.golf_project.auth.filters;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (req.getServletPath().equals("/auth/refreshToken") || req.getServletPath().equals("/auth/sign-up") || req.getServletPath().equals("/login") || req.getServletPath().equals("/mfa/verify")) {
            filterChain.doFilter(req, res);
            return;
        }

        String jwt = null;
        if (req.getCookies() != null) {
            for (Cookie cookie : req.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt != null) {
            try {
                DecodedJWT decodedJWT = jwtTokenProvider.decode(jwt);

                String username = decodedJWT.getSubject();

                List<String> rolesFromToken = decodedJWT.getClaim("roles").asList(String.class);

                List<SimpleGrantedAuthority> authorities = rolesFromToken != null
                        ? rolesFromToken.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
                        : List.of();

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                res.setContentType("application/json");

                String errorMessage = e.getMessage();
                String responseBody = String.format(
                        "{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"%s\"}",
                        errorMessage != null ? errorMessage.replace("\"", "\\\"") : "Invalid or expired token"
                );
                res.getWriter().write(responseBody);
                return;
            }
        }

        filterChain.doFilter(req, res);
    }
}