package kr.ac.ync.library.global.common.security.auth;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.domain.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);
        return new CustomUserDetails(user);
    }
}
