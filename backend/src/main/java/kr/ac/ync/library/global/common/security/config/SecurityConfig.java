package kr.ac.ync.library.global.common.security.config;

import kr.ac.ync.library.global.common.jwt.filter.JwtAuthenticationFilter;
import kr.ac.ync.library.global.common.jwt.filter.JwtExceptionFilter;
import kr.ac.ync.library.global.common.security.handler.JwtAccessDeniedHandler;
import kr.ac.ync.library.global.common.security.handler.JwtAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ 로그인, 회원가입, 토큰 관련은 허용
                        .requestMatchers( "/auth", "/auth/**").permitAll()

                        // ✅ 조회수 증가 API만 비회원 접근 허용
                        .requestMatchers(HttpMethod.POST, "/board/*/view").permitAll()

                        // ✅ 관리자
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN")

                        .requestMatchers("/user/list/**").hasAnyRole("ADMIN")
                        // ✅ 나머지 게시판 API는 로그인 필요
                        .requestMatchers("/board/**").authenticated()
                        // ✅ 리뷰, 책, 지점
                        .requestMatchers("/review/book/**").permitAll()
                        .requestMatchers("/review/list").permitAll()
                        .requestMatchers("/review/**").permitAll()
                        .requestMatchers("/book/**").permitAll()
                        .requestMatchers("/branch/**").permitAll()

                        // ✅ 나머지는 로그인 필요
                        .anyRequest().authenticated()
                )
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                        .accessDeniedHandler(jwtAccessDeniedHandler())
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtExceptionFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public JwtAccessDeniedHandler jwtAccessDeniedHandler() {
        return new JwtAccessDeniedHandler();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
