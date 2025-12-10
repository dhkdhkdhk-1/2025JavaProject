package kr.ac.ync.library.domain.reviews.service;

import kr.ac.ync.library.domain.reviews.dto.ReviewDetailResponse;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {

    void register(ReviewRegisterRequest request, Long bookId, Long userId);

    List<ReviewDetailResponse> findTop6ByBookId(Long bookId);

    Page<ReviewDetailResponse> findByBookIdPaged(Long bookId, Pageable pageable);

    void modify(ReviewModRequest request, Long userId);

    void remove(Long id, Long userId);

    List<ReviewResponse> getList();

    Page<ReviewResponse> getList(Pageable pageable);

    List<ReviewResponse> findByUserId(Long userId);

    ReviewDetailResponse findById(Long id);
}
