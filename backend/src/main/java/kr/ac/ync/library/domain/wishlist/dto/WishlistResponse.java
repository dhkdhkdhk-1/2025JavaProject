package kr.ac.ync.library.domain.wishlist.dto;

import kr.ac.ync.library.domain.books.dto.BookResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class WishlistResponse {
    private Long userId;
    private Long bookId;
    private String bookTitle;
    private String author;
    private String imageUrl;
    private LocalDateTime createdDateTime;
}
