package kr.ac.ync.library.domain.reviews.mapper;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.reviews.dto.Review;
import kr.ac.ync.library.domain.reviews.dto.ReviewRegisterRequest;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;

public class ReviewMapper {

    // 등록용
    public static ReviewEntity toEntity(ReviewRegisterRequest request, UserEntity user, BookEntity book) {
        return ReviewEntity.builder()
                .user(user)
                .book(book)
                .title(request.getTitle())
                .comment(request.getComment())
                .rating(request.getRating())
                .build();
    }

    // 조회용
    public static Review toDTO(ReviewEntity entity) {
        return Review.builder()
                .id(entity.getId())
                .bookId(entity.getBook().getId())
                .bookTitle(entity.getBook().getTitle())
                .userId(entity.getUser().getId())
                .username(entity.getUser().getUsername())
                .title(entity.getTitle())
                .comment(entity.getComment())
                .rating(entity.getRating())
                .createdDateTime(entity.getCreatedDateTime())
                .build();
    }
}
