package kr.ac.ync.library.domain.reviews.service;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.reviews.dto.ReviewDetailResponse;
import kr.ac.ync.library.domain.reviews.dto.ReviewModRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.reviews.exception.DuplicateReviewException;
import kr.ac.ync.library.domain.reviews.exception.ReviewNotFoundException;
import kr.ac.ync.library.domain.reviews.exception.UserNotMatchedException;
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

    @Override
    public void register(ReviewRegisterRequest request, Long bookId, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        if (reviewRepository.existsByBookAndUser(book, user)) {
            throw DuplicateReviewException.EXCEPTION;
        }

        ReviewEntity entity = ReviewMapper.toEntity(request, user, book);
        reviewRepository.save(entity);
    }

    @Override
    public List<ReviewDetailResponse> findTop6ByBookId(Long bookId) {
        return reviewRepository.findTop6ByBookId(bookId, Pageable.ofSize(6))
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
    }

    @Override
    public Page<ReviewDetailResponse> findByBookIdPaged(Long bookId, Pageable pageable) {
        Page<ReviewEntity> page = reviewRepository.findByBookIdPaged(bookId, pageable);

        List<ReviewDetailResponse> list = page.getContent()
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();

        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    public void modify(ReviewModRequest request, Long userId) {

        ReviewEntity old = reviewRepository.findById(request.getId())
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        if (!old.getUser().getId().equals(userId)) {
            throw UserNotMatchedException.EXCEPTION;
        }

        ReviewEntity updated = ReviewEntity.builder()
                .id(old.getId())
                .user(old.getUser())
                .book(old.getBook())
                .title(request.getTitle())
                .comment(request.getComment())
                .rating(request.getRating())
                .build();

        reviewRepository.save(updated);
    }

    @Override
    public void remove(Long id, Long userId) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        if (!review.getUser().getId().equals(userId)) {
            throw UserNotMatchedException.EXCEPTION;
        }

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getList() {
        return reviewRepository.findAll()
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    public Page<ReviewResponse> getList(Pageable pageable) {
        Page<ReviewEntity> page = reviewRepository.findAll(pageable);

        List<ReviewResponse> list = page.getContent()
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();

        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    public List<ReviewResponse> findByUserId(Long userId) {
        return reviewRepository.findByUserId(userId)
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    public ReviewDetailResponse findById(Long id) {
        ReviewEntity entity = reviewRepository.findById(id)
                .orElseThrow(() -> ReviewNotFoundException.EXCEPTION);

        return ReviewMapper.toDTO(entity);
    }
}
