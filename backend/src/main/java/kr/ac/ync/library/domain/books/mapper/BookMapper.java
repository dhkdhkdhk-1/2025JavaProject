package kr.ac.ync.library.domain.books.mapper;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import kr.ac.ync.library.domain.books.entity.BookEntity;

import java.util.stream.Collectors;

public class BookMapper {

    public static BookEntity toEntity(BookRegisterRequest request) {
        return BookEntity.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .available(request.isAvailable())
                .publisher(request.getPublisher())
                // ✅ 지점 연결은 서비스에서 처리
                .build();
    }

    public static void updateEntity(BookModRequest dto, BookEntity entity) {
        entity.uptTitle(dto.getTitle());
        entity.uptAuthor(dto.getAuthor());
        entity.uptPublisher(dto.getPublisher());
        entity.uptCategory(dto.getCategory());
        if (dto.isAvailable()) entity.markAsReturned();
        else entity.markAsBorrowed();
    }

    public static BookResponse toResponse(BookEntity entity) {
        double avgRating = 0.0;
        if (entity.getReviews() != null && !entity.getReviews().isEmpty()) {
            avgRating = entity.getReviews()
                    .stream()
                    .mapToDouble(r -> r.getRating() == null ? 0 : r.getRating())
                    .average()
                    .orElse(0.0);
        }

        // ✅ 여러 지점 이름을 쉼표로 병합 (BookBranchEntity 통해 접근)
        String branchesSummary = entity.getBookBranches() != null && !entity.getBookBranches().isEmpty()
                ? entity.getBookBranches().stream()
                .map(rel -> rel.getBranch().getName())
                .collect(Collectors.joining(", "))
                : "지점 없음";

        // ✅ 대표 branchId (첫 번째 지점 기준)
        Long firstBranchId = entity.getBookBranches() != null && !entity.getBookBranches().isEmpty()
                ? entity.getBookBranches().get(0).getBranch().getId()
                : null;

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
                .branchId(firstBranchId)
                .branchName(branchesSummary) // ✅ 여러 지점 정보 추가
                .rating(avgRating)
                .build();
    }
}
