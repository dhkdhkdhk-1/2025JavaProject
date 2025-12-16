package kr.ac.ync.library.domain.books.mapper;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;

public class BookMapper {

    /** =========================
     *  도서 등록 → Entity 변환
     *  ========================= */
    public static BookEntity toEntity(BookRegisterRequest request) {
        return BookEntity.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .available(request.isAvailable())
                .publisher(request.getPublisher())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                // ✅ 지점(BookBranch) 연결은 Service 계층에서 처리
                .build();
    }

    /** =========================
     *  도서 수정 → Entity 반영
     *  ========================= */
    public static void updateEntity(BookModRequest dto, BookEntity entity) {
        entity.uptTitle(dto.getTitle());
        entity.uptAuthor(dto.getAuthor());
        entity.uptPublisher(dto.getPublisher());
        entity.uptCategory(dto.getCategory());

        if (dto.isAvailable()) {
            entity.markAsReturned();
        } else {
            entity.markAsBorrowed();
        }

        entity.uptDescription(dto.getDescription());
        entity.uptImageUrl(dto.getImageUrl());
    }

    /** =========================
     *  Entity → Response DTO
     *  ========================= */
    public static BookResponse toResponse(BookEntity entity) {

        double avgRating = 0.0;
        if (entity.getReviews() != null && !entity.getReviews().isEmpty()) {
            avgRating = entity.getReviews()
                    .stream()
                    .mapToDouble(r -> r.getRating() == null ? 0.0 : r.getRating())
                    .average()
                    .orElse(0.0);
        }

        return BookResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .author(entity.getAuthor())
                .publisher(entity.getPublisher())
                .category(entity.getCategory())
                .available(entity.isAvailable())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .createdDateTime(entity.getCreatedDateTime())
                .modifiedDateTime(entity.getModifiedDateTime())
                .rating(avgRating)
                .build();
    }
}
