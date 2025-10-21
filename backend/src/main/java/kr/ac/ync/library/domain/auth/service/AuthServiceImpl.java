package kr.ac.ync.library.domain.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;

    @Override
    public JsonWebTokenResponse auth(AuthenticationRequest request) {
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

    @Override
    public JsonWebTokenResponse refresh(String token) {
        if (token == null || token.isBlank() || !token.contains(".")) {
            throw new IllegalArgumentException("잘못된 Refresh token 형식입니다.");
        }

        Jws<Claims> claims;
        try {
            claims = jwtProvider.getClaims(token);
        } catch (Exception e) {
            throw new IllegalArgumentException("Refresh token 파싱 실패: " + e.getMessage());
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

    @Override
    @Transactional
    public String signup(SignupRequest request) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();

            // ✅ 탈퇴한 유저가 재가입을 시도한 첫 번째 단계
            if (user.isDeleted() && !request.isRestorePosts()) {
                // 프론트에서 confirm 창을 띄울 수 있도록 "REJOIN" 반환
                System.out.println("🔁 탈퇴 계정 감지: 재가입 확인 요청");
                return "REJOIN";
            }

            // ✅ 실제 재가입 확정 처리 (restorePosts 포함)
            if (user.isDeleted()) {
                user.setDeleted(false);
                user.setUsername(request.getUsername());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.saveAndFlush(user);

                if (request.isRestorePosts()) {
                    boardRepository.updateDeletedByUserId(user.getId(), false);
                    System.out.println("✅ 게시글 복구 완료: userId=" + user.getId());
                } else {
                    System.out.println("🚫 게시글은 복원하지 않음 (DB에는 유지됨)");
                }

                boardRepository.updateUsernameByUserId(user.getId(), request.getUsername());
                return "OK";
            }

            // ✅ 이미 활성화된 계정인 경우
            return "EXISTS";
        }

        // 신규 유저 등록
        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw InvalidPasswordException.EXCEPTION;
        }

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(encodedPassword)
                .role(UserRole.USER)
                .deleted(false)
                .build();

        userRepository.saveAndFlush(user);
        return "OK";
    }

    @Override
    @Transactional
    public void withdraw(WithdrawRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        user.setDeleted(true);
        userRepository.saveAndFlush(user);

        // ✅ 게시글도 함께 숨김 처리
        boardRepository.updateDeletedByUserId(user.getId(), true);
        System.out.println("❌ 회원탈퇴 완료: userId=" + user.getId());
    }
}
