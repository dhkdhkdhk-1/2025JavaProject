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
        String path = request.getRequestURI();
        // ✅ Preflight 요청 통과 (CORS OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 인증 제외 경로 (로그인, 회원가입, 책, 지점, 조회수 증가 등)
        if (isExcludedPath(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ JWT 토큰 추출
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = null;

        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }


        // ✅ 토큰이 없거나 "Bearer"만 있는 경우는 그냥 통과 (에러 방지)
        if (!StringUtils.hasText(token) || "Bearer".equals(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 유효한 토큰이면 인증정보 저장
        if (jwtProvider.validateToken(token)) {
            Authentication authentication = jwtProvider.getAuthentication(token);
            System.out.println("AUTH = " + authentication.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isExcludedPath(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if (path.startsWith("/auth")) return true;
        if (path.startsWith("/book") && "GET".equalsIgnoreCase(method)) return true;
        if (path.startsWith("/branch") && "GET".equalsIgnoreCase(method)) return true;
        if (path.equals("/") || path.equals("/error")) return true;
        if (path.matches("^/board/\\d+/view$")) return true;

        return false;
    }

}
