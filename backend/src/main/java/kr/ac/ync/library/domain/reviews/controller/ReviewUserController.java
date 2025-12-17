package kr.ac.ync.library.domain.reviews.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.service.ReviewService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews/user")
public class ReviewUserController {

    private final ReviewService reviewService;
    private final UserSecurity userSecurity;

    // 🔹 리뷰 등록
    @PostMapping("/{bookId}")
    public void register(
            @PathVariable Long bookId,
            @Valid @RequestBody ReviewRegisterRequest request
    ) {
        User user = userSecurity.getUser();
        reviewService.register(request, bookId, user.getId());
    }

    // 🔹 리뷰 삭제
    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        User user = userSecurity.getUser();
        reviewService.remove(id, user.getId());
    }

    // 🔹 내가 쓴 리뷰 조회
    @GetMapping("/list")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(reviewService.findByUserId(user.getId()));
    }
}
