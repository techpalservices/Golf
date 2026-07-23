package com.golf.golf_project.notifications.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            Cookie[] cookies = servletRequest.getServletRequest().getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("accessToken".equals(cookie.getName())) {
                        try {
                            DecodedJWT decoded = jwtTokenProvider.decode(cookie.getValue());
                            String username = decoded.getSubject();
                            List<String> roles = decoded.getClaim("roles").asList(String.class);
                            List<SimpleGrantedAuthority> authorities = roles != null
                                    ? roles.stream().map(SimpleGrantedAuthority::new).toList()
                                    : List.of();
                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(username, null, authorities);
                            attributes.put("auth", auth);
                            log.debug("WebSocket handshake authenticated: {}", username);
                        } catch (Exception e) {
                            log.warn("WebSocket handshake auth failed: {}", e.getMessage());
                        }
                        break;
                    }
                }
            }
        }
        // Always allow connection — the STOMP channel interceptor can reject if needed
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // nothing needed, maybe i'll need it later
    }
}