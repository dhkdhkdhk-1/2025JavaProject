package kr.ac.ync.library.global.common.jwt.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.ac.ync.library.global.common.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        //전처리, JWT 인증
        String token = null;
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);//헤더부문
        //Bearer가 이미 있음
        if(StringUtils.hasText(authorization)
                && authorization.startsWith("Bearer")){
            token = authorization.substring(7);
        }

        if (token != null){
            Authentication authentication = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

        }

        filterChain.doFilter(request,response);

    }
}
