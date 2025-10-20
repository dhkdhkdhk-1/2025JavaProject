package kr.ac.ync.library.domain.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import kr.ac.ync.library.domain.users.exception.InvalidPasswordException;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import kr.ac.ync.library.global.common.jwt.JwtProvider;
import kr.ac.ync.library.global.common.jwt.enums.JwtType;
import kr.ac.ync.library.global.common.jwt.exception.TokenTypeException;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public JsonWebTokenResponse auth(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        return JsonWebTokenResponse.builder()
                .accessToken(jwtProvider.generateAccessToken(user.getEmail()))
                .refreshToken(jwtProvider.generateRefreshToken(user.getEmail()))
                .build();
    }

    // ✅ 수정됨: 비어있는 / 잘못된 RefreshToken 방어 + JWT 파싱 예외 처리
    @Override
    public JsonWebTokenResponse refresh(String token) {
        // 1️⃣ 비어있거나 잘못된 토큰 방어
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("❌ Refresh token is missing or empty");
        }
        if (!token.contains(".")) { // JWT는 최소 2개의 '.' 포함해야 함
            throw new IllegalArgumentException("❌ Invalid refresh token format");
        }

        // 2️⃣ 안전하게 파싱 (예외 캐치)
        Jws<Claims> claims;
        try {
            claims = jwtProvider.getClaims(token);
        } catch (Exception e) {
            throw new IllegalArgumentException("❌ Failed to parse refresh token: " + e.getMessage());
        }

        // 3️⃣ 토큰 타입 확인 (REFRESH 전용)
        if (jwtProvider.isWrongType(claims, JwtType.REFRESH)) {
            throw TokenTypeException.EXCEPTION;
        }

        // 4️⃣ 이메일 추출 후 새 토큰 발급
        String email = claims.getPayload().getSubject();

        return JsonWebTokenResponse.builder()
                .accessToken(jwtProvider.generateAccessToken(email))   // ✅ accessToken 재발급
                .refreshToken(jwtProvider.generateRefreshToken(email)) // ✅ refreshToken도 재발급 (옵션)
                .build();
    }

    @Override
    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }

        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw InvalidPasswordException.EXCEPTION;
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(encodedPassword)
                .role(UserRole.USER)
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void withdraw(WithdrawRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        userRepository.delete(user);
    }
}
