package com.golf.golf_project.users.wrapper;

import com.golf.golf_project.users.entities.User;
import com.golf.golf_project.users.enums.EUStatus;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    public final User user;

    public UserDetailsImpl(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.user = user;
    }

    @Override
    public List<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
    }

    @Override
    public @Nullable String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() == EUStatus.ACTIVE;
    }

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(user);
    }
}