package kr.ac.ync.library.domain.auth.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.RefreshTokenRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.auth.service.AuthService;
import kr.ac.ync.library.domain.users.entity.UserEntity;
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

    @PostMapping
    public ResponseEntity<JsonWebTokenResponse> auth(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.auth(request));
    }

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

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        String result = authService.signup(request);

        if ("EXISTS".equals(result)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("既に存在しているメールです。");
        }

        if ("REJOIN".equals(result)) {
            return ResponseEntity.ok("再加入成功：投稿の復縁をしますか？");
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@Valid @RequestBody WithdrawRequest request) {
        authService.withdraw(request);
        return ResponseEntity.ok("会員脱退が完了されました。");
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "メールが空いています。"));
        }

        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            if (user.isDeleted()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(Map.of("rejoin", true, "message", "脱退したアカウントです。もう一度加入しますか？"));
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("rejoin", false, "message", "既に存在しているメールです。"));
            }
        }
        return ResponseEntity.ok(Map.of("rejoin", false, "message", "使用可能なメールです。"));
    }
}
