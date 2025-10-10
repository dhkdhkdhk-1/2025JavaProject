package kr.ac.ync.library.domain.reviews.controller;

import jakarta.validation.Valid;

import kr.ac.ync.library.domain.reviews.dto.Review;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.reviews.exception.ReviewNotFoundException;
import kr.ac.ync.library.domain.reviews.repository.ReviewRepository;
import kr.ac.ync.library.domain.reviews.service.ReviewService;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserSecurity userSecurity;
    private final ReviewRepository reviewRepository; // 본인 확인용

    @GetMapping("/list")
    public ResponseEntity<List<ReviewResponse>> list() {
        return ResponseEntity.ok(reviewService.getList());
    }

    // 누구나 특정 책 리뷰 조회 가능
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> findByBookId(
            @PathVariable("bookId") Long bookId
    ) {
        return ResponseEntity.ok(
                reviewService.findByBookId(bookId)
        );
    }

    // 로그인한 회원만 리뷰 등록 가능
    @PostMapping("/write/{bookId}")
    public void register(
            @PathVariable("bookId") Long bookId,
            @Valid @RequestBody ReviewRegisterRequest request
    )
    {
        User user = userSecurity.getUser();
        reviewService.register(request, bookId, user.getId());
    }

    // 리뷰 수정: 로그인한 회원 본인만 가능
    @PutMapping("/mod")
    public void modify(@Valid @RequestBody ReviewModRequest request) {
        User user = userSecurity.getUser();

        // 본인인지 확인
        ReviewEntity review = reviewRepository.findById(request.getId())
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("본인 리뷰만 수정 가능합니다.");
        }

        reviewService.modify(request);
    }

    // 리뷰 삭제: 로그인한 회원 본인만 가능
    @DeleteMapping("/remove/{id}")
    public void remove(@PathVariable("id") Long id) {
        User user = userSecurity.getUser();

        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("본인 리뷰만 삭제 가능합니다.");
        }

        reviewService.remove(id);
    }
}
