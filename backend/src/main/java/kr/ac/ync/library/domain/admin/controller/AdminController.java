package kr.ac.ync.library.domain.admin.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.users.dto.AdminUserUpdateRequest;
import kr.ac.ync.library.domain.users.dto.UserResponse;
import kr.ac.ync.library.domain.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController
{
    private final UserService userService;
    @GetMapping
    public ResponseEntity get()
    {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/list")
    public ResponseEntity<Page<UserResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(userService.getList(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> adminUpdate(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.adminUpdate(id, request));
    }
}
