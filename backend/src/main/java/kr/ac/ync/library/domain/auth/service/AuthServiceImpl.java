package kr.ac.ync.library.domain.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.transaction.Transactional;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** ✅ 로그인 */
    @Override
    public JsonWebTokenResponse auth(AuthenticationRequest request) {
        // deleted=false 인 유저만 로그인 가능
        UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 탈퇴한 계정입니다."));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        return JsonWebTokenResponse.builder()
                .accessToken(jwtProvider.generateAccessToken(user.getEmail()))
                .refreshToken(jwtProvider.generateRefreshToken(user.getEmail()))
                .build();
    }

    /** ✅ 토큰 재발급 */
    @Override
    public JsonWebTokenResponse refresh(String token) {
        if (token == null || token.isBlank() || !token.contains(".")) {
            throw new IllegalArgumentException("❌ 잘못된 Refresh token 형식");
        }

        Jws<Claims> claims;
        try {
            claims = jwtProvider.getClaims(token);
        } catch (Exception e) {
            throw new IllegalArgumentException("❌ Refresh token 파싱 실패: " + e.getMessage());
        }

        if (jwtProvider.isWrongType(claims, JwtType.REFRESH)) {
            throw TokenTypeException.EXCEPTION;
        }

        String email = claims.getPayload().getSubject();

        return JsonWebTokenResponse.builder()
                .accessToken(jwtProvider.generateAccessToken(email))
                .refreshToken(jwtProvider.generateRefreshToken(email))
                .build();
    }

    /** ✅ 회원가입 (재가입 체크 포함) */
    @Override
    @Transactional
    public void signup(SignupRequest request) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();

            // 동일 이메일+전화번호가 있고 탈퇴 상태면 재가입 처리
            if (user.isDeleted() && user.getPhone().equals(request.getPhone())) {
                user.setDeleted(false);
                user.setUsername(request.getUsername());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
                return;
            }

            // 이미 활성 상태
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 신규 회원가입
        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.USER)
                .deleted(false)
                .build();

        userRepository.save(user);
    }

    /** ✅ 회원탈퇴 (DB에서 삭제 대신 deleted=true 처리) */
    @Override
    @Transactional
    public void withdraw(WithdrawRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        user.setDeleted(true); // ❗ 실제 삭제 X, 비활성 처리
        userRepository.save(user);
    }
}
