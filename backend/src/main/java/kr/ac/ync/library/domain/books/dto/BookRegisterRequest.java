package kr.ac.ync.library.domain.books.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRegisterRequest {

    @NotBlank(message = "책 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "글쓴이를 입력해주세요.")
    private String author;

    @NotNull(message = "카테고리를 선택해주세요.")
    private BookCategory category;

    private String publisher;

    private boolean available = true;

    // ★ 추가 확인
    private String description; // 줄거리
    private String imageUrl;    // 이미지 URL

    @NotNull(message = "지점ID(branchId)는 필수입니다.")
    private Long branchId;      // ★ 반드시 필요
}
