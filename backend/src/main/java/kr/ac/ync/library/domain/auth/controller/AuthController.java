package kr.ac.ync.library.domain.auth.controller;

import jakarta.validation.Valid;

import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.request.RefreshTokenRequest;
import kr.ac.ync.library.domain.auth.dto.request.SignupRequest;
import kr.ac.ync.library.domain.auth.dto.request.WithdrawRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;
import kr.ac.ync.library.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController
{

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<JsonWebTokenResponse> auth(@Valid @RequestBody AuthenticationRequest request)
    {
        return ResponseEntity.ok(authService.auth(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JsonWebTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request)
    {

        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request); // 회원가입 DB 저장
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<String> withdraw(@Valid @RequestBody WithdrawRequest request) {
        authService.withdraw(request);  // 회원탈퇴 DB 삭제
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    }

}
