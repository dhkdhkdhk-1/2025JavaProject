package kr.ac.ync.library.domain.rentals.controller;

import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.service.RentalService;
import kr.ac.ync.library.global.common.mail.service.MailService;
import kr.ac.ync.library.global.common.mail.util.MailTemplateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rentals/admin")
public class RentalAdminController {

    private final RentalService rentalService;
    private final MailService mailService;

    // 전체 대여 목록
    @GetMapping("/list")
    public ResponseEntity<List<RentalResponse>> list() {
        return ResponseEntity.ok(rentalService.getList());
    }

    // 연체 목록
    @GetMapping("/overdue")
    public ResponseEntity<List<RentalResponse>> overdue() {
        return ResponseEntity.ok(rentalService.findOverdueRentals());
    }

    // 🔥 반납 처리 (관리자)
    @PutMapping("/return/{rentalId}")
    public ResponseEntity<Void> returnBook(@PathVariable Long rentalId) {
        rentalService.approveReturn(rentalId);
        return ResponseEntity.ok().build();
    }

    // 연체 메일
    @PostMapping("/notify/{rentalId}")
    public ResponseEntity<Void> notifyUser(@PathVariable Long rentalId) {
        RentalResponse rental = rentalService.findById(rentalId);
        String body = MailTemplateUtil.buildOverdueMailBody(rental);

        mailService.sendEmail(
                rental.getUserEmail(),
                "[図書返却のご案内] " + rental.getBookTitle(),
                body
        );
        return ResponseEntity.ok().build();
    }
}
