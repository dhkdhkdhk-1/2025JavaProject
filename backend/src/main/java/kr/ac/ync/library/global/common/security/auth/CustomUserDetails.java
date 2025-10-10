package kr.ac.ync.library.global.common.security.auth;

import kr.ac.ync.library.domain.users.dto.User; // ✅ 꼭 DTO User import
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class CustomUserDetails implements UserDetails {

    private final User user; // 1번 프로젝트 User DTO
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.user = user;
        this.authorities = Collections.singleton(
                new SimpleGrantedAuthority(
                        user.getRole() == UserRole.ADMIN ? "ROLE_ADMIN" : "ROLE_USER"
                )
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
