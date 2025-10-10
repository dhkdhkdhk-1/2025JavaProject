package kr.ac.ync.library.domain.auth.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.enums.UserRole;
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
        Authentication authentication = authenticationManager
                .authenticate
                        (new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));


        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        //얘 이메일이 로그인 하고자 한 값이라 이거를 Json토큰을 만들어서 응답을 함

        return JsonWebTokenResponse.builder()
                .accessToken(jwtProvider.generateAccessToken(user.getEmail()))
                .refreshToken(jwtProvider.generateRefreshToken(user.getEmail()))
                .build();
    }

    @Override
    public JsonWebTokenResponse refresh(String token) {

        Jws<Claims> claims = jwtProvider.getClaims(token);
        if (jwtProvider.isWrongType(claims, JwtType.REFRESH)) {
            throw TokenTypeException.EXCEPTION;
        }

        String email = claims.getPayload().getSubject();
        return JsonWebTokenResponse.builder()
                .accessToken((jwtProvider.generateRefreshToken(email)))
                .build();
    }

    @Override
    @Transactional
    public void signup(SignupRequest request) {

        // 이메일 ID 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }

        // 비밀번호 확인
        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 닉네임 중복 체크
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        // 전화번호 중복 체크
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("이미 존재하는 번호입니다.");

        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 회원가입 데이터 저장
        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(encodedPassword)
                .phone(request.getPhone())
                .role(UserRole.USER)         // 일반 유저로 고정
                .build();

        userRepository.save(user);


    }

    @Override
    @Transactional
    public void withdraw(WithdrawRequest request) { // 회원탈퇴
        // 이메일로 사용자 조회
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 회원탈퇴 유저 데이터 삭제
        userRepository.delete(user);
    }

}
