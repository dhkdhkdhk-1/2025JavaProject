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
                        .requestMatchers("/auth/**").permitAll()

                        // 공개 API
                        .requestMatchers(HttpMethod.POST, "/board/*/view").permitAll()
                        .requestMatchers(HttpMethod.GET, "/book/**", "/branch/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reviews/**").permitAll()

                        // 🔥 관리자 화면 접근 (ADMIN + MANAGER)
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "MANAGER")

                        // 🔥 CS 관리자 API (ADMIN + MANAGER)
                        .requestMatchers("/cs/admin/**").hasAnyRole("ADMIN", "MANAGER")

                        // ADMIN 전용
                        .requestMatchers("/user/list/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/book/**", "/branch/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT,  "/book/**", "/branch/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE,"/book/**", "/branch/**").hasAnyRole("ADMIN", "MANAGER")

                        // 로그인 필요
                        .requestMatchers("/cs/**").authenticated()
                        .requestMatchers("/wishlist/**").authenticated()
                        .requestMatchers("/board/**").authenticated()

                        .anyRequest().authenticated()
                )

                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                        .accessDeniedHandler(jwtAccessDeniedHandler())
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                //.addFilterBefore(jwtExceptionFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        System.out.println("entry");
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public JwtAccessDeniedHandler jwtAccessDeniedHandler() {
        System.out.println("deniedhandler");
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
