package kr.ac.ync.library.global.common.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import kr.ac.ync.library.global.common.jwt.enums.JwtType;
import kr.ac.ync.library.global.common.jwt.exception.TokenTypeException;
import kr.ac.ync.library.global.common.jwt.properties.JwtProperties;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtProvider {
    private final JwtProperties jwtProperties;
    private final UserRepository userRepository;


    public Jws<Claims> getClaims(String token)
    {
        try
        {
            return Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
        }
        catch(ExpiredJwtException e) { throw new JwtException("Expired JWT", e); }
        catch ( UnsupportedJwtException e) { throw new JwtException("Unsupported JWT", e); } // 토큰 만료
        catch ( MalformedJwtException e) { throw new JwtException("Malformed JWT", e); } //구조가 잘못된 JWT
        catch ( SignatureException e) { throw new JwtException("Invalid JWT", e); } // 서명이 잘몬된 JWT
        catch ( IllegalArgumentException e) { throw new JwtException("Unsupported JWT", e); } //널 빈 문자열
        catch ( WeakKeyException e) { throw new JwtException("Unsupported JWT", e); } // 알고리즘 예외


    }


    public String generateAccessToken(String email) {
        return Jwts.builder()
                .header()
                .add(Header.JWT_TYPE, JwtType.ACCESS)
                .and()
                .subject(email) // sub
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .header()
                .add(Header.JWT_TYPE, JwtType.REFRESH)
                .and()
                .subject(email) // sub
                .issuedAt(new Date(
                        System.currentTimeMillis()
                ))
                .expiration(new Date(
                        System.currentTimeMillis() + jwtProperties.getRefreshExpiration()
                ))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8)
        );
    }

    public boolean isWrongType(final Jws<Claims> claims, final JwtType jwtType) {
        return !(claims.getHeader().get(Header.JWT_TYPE).equals(jwtType.toString()));
    }

    public Authentication getAuthentication(String token)
    {
        Jws<Claims> claims = getClaims(token);
        if(isWrongType(claims, JwtType.ACCESS))
        {
            throw TokenTypeException.EXCEPTION;
        }

        String email= claims.getPayload().getSubject();
        User user = userRepository.findByEmail(email)
                .map(UserMapper::toDTO)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken
                (customUserDetails, null, customUserDetails.getAuthorities());

        return authentication;

    }
}
