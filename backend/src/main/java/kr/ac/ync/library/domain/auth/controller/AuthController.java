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
import kr.ac.ync.library.global.common.mail.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final MailService mailService; // ⭐ 기존 방식 그대로 주입
    private final Map<String, String> verifyCodeStore = new ConcurrentHashMap<>();

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

    @PostMapping("/find-password/send-code")
    public ResponseEntity<?> sendVerifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1) 이메일이 등록되어 있는지 확인
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "登録されていないメールです。"));
        }

        // 2) 인증번호 생성
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        verifyCodeStore.put(email, code);

        // 3) 이메일 내용 작성
        String subject = "[パスワード再設定 認証番号]";
        String text = """
        こんにちは。

        パスワード再設定のための認証番号は以下の通りです。

        認証番号: %s

        認証番号は10分間のみ有効です。

        -- YNC Library System --
        """.formatted(code);

        // 4) 메일 발송
        mailService.sendEmail(email, subject, text);

        // 5) 성공 응답
        return ResponseEntity.ok(Map.of("message", "認証番号をメールに送信しました。"));
    }

}
