package kr.ac.ync.library.domain.rentals.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.rentals.dto.RentalRegisterRequest;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.dto.RentalReturnRequest;
import kr.ac.ync.library.domain.rentals.service.RentalService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rental")
public class RentalController {

    private final RentalService rentalService;
    private final UserSecurity userSecurity;

    // ✅ 전체 대여 목록 (관리자용)
    @GetMapping("/list")
    public ResponseEntity<List<RentalResponse>> list() {
        return ResponseEntity.ok(rentalService.getList());
    }

    // ✅ 로그인한 유저의 대여 내역
    @GetMapping("/my")
    public ResponseEntity<List<RentalResponse>> myRentals() {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(rentalService.getListByUser(user.getId()));
    }

    // ✅ 대여 등록
    @PostMapping("/register")
    public void register(@Valid @RequestBody RentalRegisterRequest request) {
        User user = userSecurity.getUser();
        rentalService.register(request, user.getId());
    }

    // ✅ 반납 처리
    @PutMapping("/return")
    public void returnBook(@Valid @RequestBody RentalReturnRequest request) {
        User user = userSecurity.getUser();
        rentalService.returnBook(request, user.getId());
    }
}
