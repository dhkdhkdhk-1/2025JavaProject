package kr.ac.ync.library.domain.auth.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.jwt.JwtProvider;
import kr.ac.ync.library.global.common.jwt.enums.JwtType;
import kr.ac.ync.library.global.common.jwt.exception.TokenTypeException;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService
{

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;


    @Override
    public JsonWebTokenResponse auth(AuthenticationRequest request)
    {
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
    public JsonWebTokenResponse refresh(String token)
    {

        Jws<Claims> claims = jwtProvider.getClaims(token);
        if(jwtProvider.isWrongType(claims, JwtType.REFRESH))
        {
            throw TokenTypeException.EXCEPTION;
        }

        String email= claims.getPayload().getSubject();
        return JsonWebTokenResponse.builder()
                .accessToken((jwtProvider.generateRefreshToken(email)))
                .build();
    }
}
