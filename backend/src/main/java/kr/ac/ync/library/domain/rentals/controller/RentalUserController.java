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
@RequestMapping("/rentals")
public class RentalUserController {

    private final RentalService rentalService;
    private final UserSecurity userSecurity;

    // ✅ 로그인한 유저의 대여 내역
    @GetMapping("/me")
    public ResponseEntity<List<RentalResponse>> myRentals() {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(rentalService.getListByUser(user.getId()));
    }

    // ✅ 대여 등록
    @PostMapping
    public ResponseEntity<Void> register(@Valid @RequestBody RentalRegisterRequest request) {
        User user = userSecurity.getUser();
        rentalService.register(request, user.getId());
        return ResponseEntity.ok().build();
    }

    // ✅ 반납 처리
    @PutMapping("/{rentalId}")
    public ResponseEntity<Void> returnBook(@PathVariable Long rentalId) {
        User user = userSecurity.getUser();
        RentalReturnRequest request = new RentalReturnRequest();
        request.setRentalId(rentalId);
        rentalService.returnBook(request, user.getId());
        return ResponseEntity.ok().build();
    }
}
