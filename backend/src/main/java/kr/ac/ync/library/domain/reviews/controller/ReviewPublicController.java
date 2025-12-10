package kr.ac.ync.library.domain.reviews.controller;

import kr.ac.ync.library.domain.reviews.dto.ReviewDetailResponse;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewPublicController {

    private final ReviewService reviewService;

    // 🔹 책 상세 페이지 — 최신 리뷰 6개
    @GetMapping("/book/{bookId}/top")
    public ResponseEntity<List<ReviewDetailResponse>> getTop6(
            @PathVariable Long bookId
    ) {
        return ResponseEntity.ok(reviewService.findTop6ByBookId(bookId));
    }

    // 🔹 책 리뷰 전체 보기 — 페이징 (10개씩)
    @GetMapping("/book/{bookId}")
    public ResponseEntity<Page<ReviewDetailResponse>> getPagedReviews(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PageRequest pageable = PageRequest.of(page, 10);
        return ResponseEntity.ok(reviewService.findByBookIdPaged(bookId, pageable));
    }

    // 🔹 단일 리뷰 조회
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDetailResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }
}
