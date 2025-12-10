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

    // ✅ 전체 대여 목록 (관리자용)
    @GetMapping("/list")
    public ResponseEntity<List<RentalResponse>> list() {
        return ResponseEntity.ok(rentalService.getList());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<RentalResponse>> getOverdueRentals() {
        return ResponseEntity.ok(rentalService.findOverdueRentals());
    }

    @PostMapping("/notify/{rentalId}")
    public ResponseEntity<Void> notifyUser(@PathVariable Long rentalId) {
        RentalResponse rental = rentalService.findById(rentalId);
        String text = MailTemplateUtil.buildOverdueMailBody(rental);
        mailService.sendEmail(rental.getUserEmail(), "[도서 반납 안내] " + rental.getBookTitle(), text);
        return ResponseEntity.ok().build();
    }
}
