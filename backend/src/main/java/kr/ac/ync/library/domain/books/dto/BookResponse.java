package kr.ac.ync.library.domain.books.dto;

import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private BookCategory category;
    private String publisher;
    private boolean available;

    private String description;
    private String imageUrl;

    private Double rating;

    private LocalDateTime createdDateTime;
    private LocalDateTime modifiedDateTime;
}
