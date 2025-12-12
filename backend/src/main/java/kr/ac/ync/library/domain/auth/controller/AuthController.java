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
            return ResponseEntity.ok("REJOIN");
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
            if (Boolean.TRUE.equals(user.getDeleted())) {
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

    @PostMapping("/find-password/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        String savedCode = verifyCodeStore.get(email);
        boolean verified = savedCode != null && savedCode.equals(code);

        return ResponseEntity.ok(Map.of("verified", verified));
    }

    @PostMapping("/find-password/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "メールが存在しません。"));
        }

        UserEntity user = userOpt.get();
        authService.updatePasswordByEmail(email, newPassword);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/signup/send-code")
    public ResponseEntity<?> sendSignupVerifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1) 이메일 유효성 체크
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "メールを入力してください。"));
        }

        // 2) 이미 가입된 이메일인지 확인
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && !userOpt.get().getDeleted()) {
            return ResponseEntity.status(409).body(Map.of("message", "既に存在しているメールです。"));
        }

        // 3) 인증번호 생성
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        // 메모리 저장소에 저장 (10분 등 유효시간 로직은 프론트 타이머로 처리)
        verifyCodeStore.put(email, code);

        // 4) 메일 템플릿
        String subject = "[会員登録 認証番号]";
        String text = """
        こんにちは。

        会員登録のための認証番号は以下の通りです。

        認証番号: %s

        認証番号は3分間のみ有効です。

        -- YNC Library System --
    """.formatted(code);

        // 5) 이메일 발송
        mailService.sendEmail(email, subject, text);

        return ResponseEntity.ok(Map.of("message", "認証番号をメールに送信しました。"));
    }

    @PostMapping("/signup/verify-code")
    public ResponseEntity<?> verifySignupCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("verified", false));
        }

        String savedCode = verifyCodeStore.get(email);
        boolean verified = savedCode != null && savedCode.equals(code);

        return ResponseEntity.ok(Map.of("verified", verified));
    }

    @PostMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email"); // 📌 추가

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("available", false));
        }

        // 📌 email 이 있는 경우 = 재가입 체크 (또는 현재 본인 정보 수정)
        if (email != null && !email.isBlank()) {
            var userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();

                // 📌 기존 유저 닉네임과 완전히 동일하다면 → 중복 아님
                if (username.equals(user.getUsername())) {
                    return ResponseEntity.ok(Map.of("available", true));
                }
            }
        }

        // ▼ 일반 중복 체크
        boolean exists = userRepository.existsByUsername(username);

        return ResponseEntity.ok(Map.of("available", !exists));
    }



}
