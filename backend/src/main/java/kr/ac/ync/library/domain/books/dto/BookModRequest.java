package kr.ac.ync.library.domain.books.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookModRequest {
    @NotNull(message = "책 ID를 입력해주세요.")
    private Long id;
    @NotBlank(message = "책 제목을 입력해주세요.")
    private String title;
    @NotBlank(message = "글쓴이를 입력해주세요.")
    private String author;

    @NotNull(message = "카테고리를 선택해주세요.")
    private BookCategory category;

    private String publisher;

    private boolean available;

}
