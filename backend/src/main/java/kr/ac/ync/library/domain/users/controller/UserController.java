package kr.ac.ync.library.domain.users.controller;

import kr.ac.ync.library.domain.users.dto.PasswordUpdateRequest;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.dto.UserResponse;
import kr.ac.ync.library.domain.users.dto.UserUpdateRequest;
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

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserSecurity userSecurity;
    private final UserService userService;

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

    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest request, Authentication auth) {
        String email = auth.getName();
        userService.updatePassword(email, request);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }




}
