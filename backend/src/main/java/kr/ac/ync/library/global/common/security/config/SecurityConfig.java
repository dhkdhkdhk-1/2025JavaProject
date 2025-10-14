package kr.ac.ync.library.global.common.security.config;

import kr.ac.ync.library.global.common.jwt.filter.JwtAuthenticationFilter;
import kr.ac.ync.library.global.common.jwt.filter.JwtExceptionFilter;
import kr.ac.ync.library.global.common.security.handler.JwtAccessDeniedHandler;
import kr.ac.ync.library.global.common.security.handler.JwtAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;                                    // ⬅ 추가
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;                      // ⬅ 추가
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// ⬇ Security에서 사용할 CORS 설정 소스 (권장)
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtExceptionFilter jwtExceptionFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ Security 레벨에서 CORS 활성화 (아래 corsConfigurationSource()를 사용)
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ Preflight 요청은 전부 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN")
                        .requestMatchers("/review/book/**").permitAll()
                        .requestMatchers("/review/list").permitAll()
                        .requestMatchers("/review/**").hasAnyRole("USER", "MANAGER", "ADMIN")
                        .requestMatchers("/book/**").permitAll()
                        .requestMatchers("/branch/**").permitAll()

                        // 그 외는 인증 필요 (/user/me 포함)
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

    // ✅ Security가 참조할 CORS 설정 (WebMvcConfigurer만 두는 것보다 확실)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 개발용: http://localhost:3000 허용
        config.addAllowedOrigin("http://localhost:3000");
        // 필요 시: 와일드카드 패턴 사용하고 싶다면 대신 아래를 사용
        // config.addAllowedOriginPattern("*");

        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // GET,POST,PUT,DELETE,OPTIONS 모두

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 위 CORS 적용
        source.registerCorsConfiguration("/**", config);
        return source;
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
