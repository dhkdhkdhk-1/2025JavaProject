package kr.ac.ync.library.domain.books.dto;

import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class BookResponse {
    private Long id; // 도서 ID
    private String title; // 제목
    private String author; // 저자
    private BookCategory category; // 카테고리 (Enum)
    private String publisher; // 출판사
    private boolean available; // 대여 가능 여부
    private String description; // description 줄거리
    private String imageUrl;    // imageUrl 사진 저장
    private LocalDateTime createdDateTime; // 등록일
    private LocalDateTime modifiedDateTime;
    private Long branchId;
}
