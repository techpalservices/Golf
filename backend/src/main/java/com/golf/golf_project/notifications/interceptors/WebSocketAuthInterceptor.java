package com.golf.golf_project.notifications.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.golf.golf_project.auth.providers.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            if (accessor.getSessionAttributes() != null
                    && accessor.getSessionAttributes().get("auth") instanceof Authentication auth) {
                accessor.setUser(auth);
                return message;
            }

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                try {
                    DecodedJWT decodedJWT = jwtTokenProvider.decode(token);
                    String username = decodedJWT.getSubject();

                    List<String> rolesFromToken =
                            decodedJWT.getClaim("roles").asList(String.class);

                    List<SimpleGrantedAuthority> authorities = rolesFromToken != null
                            ? rolesFromToken.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList())
                            : List.of();

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username, null, authorities);

                    accessor.setUser(authentication);
                    log.debug("WebSocket authenticated for user: {}", username);

                } catch (Exception e) {
                    log.warn("WebSocket auth failed: {}", e.getMessage());
                }
            }
        }

        return message;
    }
}
