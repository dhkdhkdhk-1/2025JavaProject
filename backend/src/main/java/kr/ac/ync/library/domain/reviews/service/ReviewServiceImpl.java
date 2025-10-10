package kr.ac.ync.library.domain.reviews.service;

import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.reviews.dto.Review;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.reviews.exception.ReviewNotFoundException;
import kr.ac.ync.library.domain.reviews.mapper.ReviewMapper;
import kr.ac.ync.library.domain.reviews.repository.ReviewRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // 리뷰 등록
    @Override
    public void register(ReviewRegisterRequest request, Long bookId, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        ReviewEntity reviewEntity = ReviewMapper.toEntity(request, user, book);
        reviewRepository.save(reviewEntity);
    }

    // 책별 리뷰 조회
    @Override
    public List<Review> findByBookId(Long bookId) {
        return reviewRepository.findByBookId(bookId)
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
    }

    // 리뷰 수정
    @Override
    public void modify(ReviewModRequest request) {
        ReviewEntity oldReview = reviewRepository.findById(request.getId())
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        // 새 DTO 기반 엔티티 생성
        ReviewEntity updatedReview = ReviewEntity.builder()
                .id(oldReview.getId())
                .user(oldReview.getUser())
                .book(oldReview.getBook())
                .title(request.getTitle())
                .comment(request.getComment())
                .rating(request.getRating())
                .build();

        reviewRepository.save(updatedReview);
    }

    // 리뷰 삭제
    @Override
    public void remove(Long id) {
        reviewRepository.findById(id)
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);
        reviewRepository.deleteById(id);
    }

    @Override
    public List<ReviewResponse> getList()
    {
        // 모든 리뷰 조회 후 ReviewResponse로 변환
        return reviewRepository.findAll()
                .stream().map(ReviewMapper::toResponse).toList();
    }

    @Override // 리뷰 한페이지에15개
    public Page<ReviewResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(6).withPage(pageable.getPageNumber());

        // DB에서 리뷰 조회
        Page<ReviewEntity> page = reviewRepository.findAll(fixedPageable);

        // 엔티티 -> DTO 변환
        List<ReviewResponse> responses =
                page.getContent().stream()
                .map(ReviewMapper::toResponse).toList();

        // Page<ReviewResponse> 반환
        return new PageImpl<>(responses, fixedPageable, page.getTotalElements());
    }
}
