package kr.ac.ync.library.domain.cs.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.cs.dto.CsListResponse;
import kr.ac.ync.library.domain.cs.dto.CsRegisterRequest;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.service.CsService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.service.UserService;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cs")
public class CsController {

    private final CsService csService;
    private final UserSecurity userSecurity;
    private final UserService userService;

    @PostMapping
    public ResponseEntity register(
            @Valid @RequestBody CsRegisterRequest csRegisterRequest)
    {
        csService.register(csRegisterRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/list/me")
    public ResponseEntity getMyCsList() {
        User user = userSecurity.getUser();
        Page<CsListResponse> myList = csService.getMyList(user.getId(), Pageable.ofSize(10));
        return ResponseEntity.ok(myList);
    }
}
