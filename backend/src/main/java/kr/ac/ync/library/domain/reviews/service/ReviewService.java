package kr.ac.ync.library.domain.reviews.service;

import kr.ac.ync.library.domain.reviews.dto.ReviewDetailResponse;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {

    /** 리뷰 등록 */
    void register(ReviewRegisterRequest request, Long bookId, Long userId);

    /** 책 상세 – 최신 리뷰 6개 */
    List<ReviewDetailResponse> findTop6ByBookId(Long bookId);

    /** 책별 리뷰 페이징 */
    Page<ReviewDetailResponse> findByBookIdPaged(Long bookId, Pageable pageable);

    /** 리뷰 수정 */
    void modify(ReviewModRequest request, Long userId);

    /** 리뷰 삭제 */
    void remove(Long id, Long userId);

    /** 전체 리뷰 목록 (관리자 등) */
    List<ReviewResponse> getList();

    /** 전체 리뷰 페이징 */
    Page<ReviewResponse> getList(Pageable pageable);

    /** 내가 쓴 리뷰 목록 */
    List<ReviewResponse> findByUserId(Long userId);

    /** 단일 리뷰 조회 */
    ReviewDetailResponse findById(Long id);

    /** ⭐ 특정 책에 대해 내가 쓴 리뷰 조회 */
    ReviewResponse findMyReviewByBook(Long bookId, Long userId);
}
