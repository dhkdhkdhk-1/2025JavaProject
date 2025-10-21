package kr.ac.ync.library.domain.users.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.auth.service.AuthService;
import kr.ac.ync.library.domain.users.dto.*;
import kr.ac.ync.library.domain.users.service.UserService;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserSecurity userSecurity;
    private final UserService userService;
    private final AuthService authService;

    // 현재 로그인한 사용자 정보 확인
    @GetMapping("/me")
    public ResponseEntity<User> getMyInfo()
    {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyInfo(@RequestBody UserUpdateRequest request, Authentication auth) {
        String email = auth.getName(); // JWT에서 email 추출
        return ResponseEntity.ok(userService.updateMyInfo(email, request));
    }

    @PutMapping("/me/v2")
    public ResponseEntity<UserResponse> updateMyInfo1(@RequestBody UserUpdateRequest request, Authentication auth) {
        String email = auth.getName(); // JWT에서 email 추출
        return ResponseEntity.ok(authService.updateMyInfo1(email, request)); // ✅ AuthServiceImpl로 연결
    }


    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest request, Authentication auth) {
        String email = auth.getName();
        userService.updatePassword(email, request);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    @GetMapping("/list")
    public ResponseEntity<Page<UserResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(userService.getList(pageable));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<UserResponse> adminUpdate(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.adminUpdateUser(id, request));
    }

    @GetMapping("/list/admin")
    public ResponseEntity<Page<UserResponse>> listAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(userService.getAdmins(pageable));
    }
}
