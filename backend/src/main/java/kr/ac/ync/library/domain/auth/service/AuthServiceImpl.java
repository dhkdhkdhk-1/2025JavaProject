package kr.ac.ync.library.domain.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.users.dto.UserResponse;
import kr.ac.ync.library.domain.users.dto.UserUpdateRequest;
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

        // 🔥 deleted: Boolean 대응 → null-safe
        UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                .filter(u -> !Boolean.TRUE.equals(u.getDeleted()))
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

        Optional<UserEntity> existingUserOpt = userRepository.findByEmail(request.getEmail());

        if (existingUserOpt.isPresent()) {
            UserEntity user = existingUserOpt.get();

            // 🔥 Boolean deleted 대응
            if (Boolean.TRUE.equals(user.getDeleted())) {

                // 🔥 1단계 – 재가입 의사 확인
                Boolean confirm = request.getRejoinConfirm();
                if (confirm == null || !confirm) {
                    return "REJOIN";
                }

                // 🔥 2단계 – 실제 재가입 처리
                user.setDeleted(false);
                user.setUsername(request.getUsername());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.saveAndFlush(user);

                // 🔥 restorePosts
                if (Boolean.TRUE.equals(request.isRestorePosts())) {
                    boardRepository.updateDeletedByUserId(user.getId(), false);
                }

                return "OK";
            }

            // 이미 사용 중인 이메일
            return "EXISTS";
        }

        // 🔥 신규 가입
        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw InvalidPasswordException.EXCEPTION;
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        UserEntity newUser = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .deleted(false)
                .build();

        userRepository.saveAndFlush(newUser);

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

        // 🔥 게시글 soft delete
        boardRepository.updateDeletedByUserId(user.getId(), true);
        System.out.println("❌ 회원탈퇴 완료: userId=" + user.getId());
    }

    @Override
    @Transactional
    public UserResponse updateMyInfo(String email, UserUpdateRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호 확인이 일치하지 않습니다.");
        }

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        user.setUsername(request.getUsername());
        userRepository.saveAndFlush(user);

        // 게시판 작성자명도 변경
        boardRepository.updateUsernameByUserId(user.getId(), request.getUsername());

        return new UserResponse(user);
    }

    @Override
    @Transactional
    public void updatePasswordByEmail(String email, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.saveAndFlush(user);
    }
}
