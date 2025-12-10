package kr.ac.ync.library.domain.cs.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.cs.dto.CsDetailResponse;
import kr.ac.ync.library.domain.cs.dto.CsUserListResponse;
import kr.ac.ync.library.domain.cs.dto.CsUserRegisterRequest;
import kr.ac.ync.library.domain.cs.service.CsService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cs")
public class CsUserController {

    private final CsService csService;
    private final UserSecurity userSecurity;

    @PostMapping
    public ResponseEntity<Void> register(
            @Valid @RequestBody CsUserRegisterRequest csRegisterRequest)
    {
        csService.register(csRegisterRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list/me")
    public ResponseEntity<Page<CsUserListResponse>> getMyCsList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User user = userSecurity.getUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<CsUserListResponse> myList = csService.getMyList(user.getId(), pageable);
        return ResponseEntity.ok(myList);
    }

    @GetMapping("/{csId}")
    public ResponseEntity<CsDetailResponse> getCsDetail(@PathVariable Long csId) {
        CsDetailResponse detail = csService.get(csId);
        return ResponseEntity.ok(detail);
    }
}
