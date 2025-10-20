package kr.ac.ync.library.domain.auth.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.RefreshTokenRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.auth.service.AuthService;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    /** ✅ 로그인 */
    @PostMapping
    public ResponseEntity<JsonWebTokenResponse> auth(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.auth(request));
    }

    /** ✅ 토큰 재발급 */
    @PostMapping("/refresh")
    public ResponseEntity<JsonWebTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        if (request == null || request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            return ResponseEntity.badRequest().body(
                    JsonWebTokenResponse.builder()
                            .accessToken(null)
                            .refreshToken(null)
                            .build()
            );
        }
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    /** ✅ 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    /** ✅ 회원탈퇴 */
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@Valid @RequestBody WithdrawRequest request) {
        authService.withdraw(request);
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    }

    /** ✅ 이메일 중복 확인 */
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "이메일이 비어 있습니다."));
        }

        boolean exists = userRepository.existsByEmail(email);
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "이미 존재하는 이메일입니다."));
        }

        return ResponseEntity.ok(Map.of("message", "사용 가능한 이메일입니다."));
    }
}
