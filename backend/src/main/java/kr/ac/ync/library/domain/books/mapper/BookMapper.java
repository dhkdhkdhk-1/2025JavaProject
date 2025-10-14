package kr.ac.ync.library.domain.books.mapper;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;

public class BookMapper {

    private BookMapper() {}

    public static BookEntity toEntity(BookRegisterRequest request) {
        return BookEntity.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .available(request.isAvailable())
                .publisher(request.getPublisher())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                // branch는 Service에서 세팅
                .build();
    }

    // 필요 시 수정용 델타 적용에 쓸 수 있으나, 현재는 서비스에서 직접 엔티티 변경하고 있음
    public static void updateEntity(BookModRequest dto, BookEntity entity) {
        entity.uptTitle(dto.getTitle());
        entity.uptAuthor(dto.getAuthor());
        entity.uptPublisher(dto.getPublisher());
        entity.uptCategory(dto.getCategory());
        if (dto.isAvailable()) entity.markAsReturned(); else entity.markAsBorrowed();
        // branch, description, imageUrl은 서비스에서 처리 권장
    }

    public static BookResponse toResponse(BookEntity entity) {
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
                .branchId(entity.getBranch() != null ? entity.getBranch().getId() : null)
                .build();
    }
}
