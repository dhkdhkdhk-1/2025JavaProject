package kr.ac.ync.library.domain.rentals.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.rentals.dto.RentalRegisterRequest;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.dto.RentalReturnRequest;
import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import kr.ac.ync.library.domain.rentals.mapper.RentalMapper;
import kr.ac.ync.library.domain.rentals.service.RentalService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.mail.service.MailService;
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
    private final MailService mailService;

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

    @PostMapping("/notify/{rentalId}")
    public ResponseEntity<Void> notifyUser(@PathVariable Long rentalId) {
        RentalResponse rental = rentalService.findById(rentalId);

        String email = rental.getUserEmail();
        String bookTitle = rental.getBookTitle();
        String username = rental.getUserName();
        String dueDate = rental.getDueDate().toLocalDate().toString();

        String subject = "[도서 반납 안내] " + bookTitle;
        String text = """
        안녕하세요, %s 님

        대여하신 도서 "%s"의 반납 예정일은 %s 입니다.
        반납일이 지나 연체로 처리되었으니 빠른 반납 부탁드립니다.

        감사합니다.
        - 영남이공대학교 도서관리 시스템
        """.formatted(username, bookTitle, dueDate);

        // ✅ 4. 메일 발송
        mailService.sendEmail(email, subject, text);

        // ✅ 5. OK 반환
        return ResponseEntity.ok().build();
    }
}
