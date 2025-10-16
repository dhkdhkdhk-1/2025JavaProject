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
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtExceptionFilter jwtExceptionFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CORS 설정을 코드 내부에서 환경별로 처리
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();

                    // 현재 활성화된 profile 확인
                    String activeProfile = System.getProperty("spring.profiles.active", "dev");
                    System.out.println("✅ Active Profile: " + activeProfile);

                    if ("prod".equalsIgnoreCase(activeProfile)) {
                        // 운영 환경용 S3 주소
                        config.setAllowedOrigins(Arrays.asList(
                                "http://ync-library-frontend.s3-website-ap-northeast-2.amazonaws.com"
                        ));
                    } else {
                        // 로컬 개발 환경용
                        config.setAllowedOrigins(Arrays.asList(
                                "http://localhost:3000"
                        ));
                    }

                    config.setAllowedHeaders(Arrays.asList("*"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ Preflight 요청은 전부 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ 인증 없이 접근 가능한 엔드포인트
                        .requestMatchers("/auth/**", "/auth").permitAll()
                        .requestMatchers("/book/**").permitAll()
                        .requestMatchers("/branch/**").permitAll()
                        .requestMatchers("/review/book/**", "/review/list").permitAll()

                        // ✅ 관리자 전용
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN")

                        // ✅ 나머지 요청은 인증 필요
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
