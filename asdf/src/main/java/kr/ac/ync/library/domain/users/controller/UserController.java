package kr.ac.ync.library.domain.users.controller;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserSecurity userSecurity;

    // 현재 로그인한 사용자 정보 확인
    @GetMapping("/me")
    public ResponseEntity<User> getMyInfo()
    {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(user);
    }
}
