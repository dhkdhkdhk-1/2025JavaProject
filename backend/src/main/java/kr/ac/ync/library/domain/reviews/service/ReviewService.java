package kr.ac.ync.library.domain.reviews.service;

import kr.ac.ync.library.domain.reviews.dto.Review;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;

import java.util.List;

public interface ReviewService {

    void register(ReviewRegisterRequest request, Long bookId, Long userId);

    List<Review> findByBookId(Long bookId);

    void modify(ReviewModRequest request);

    void remove(Long id);
}
