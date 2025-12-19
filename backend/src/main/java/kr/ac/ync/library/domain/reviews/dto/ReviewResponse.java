package kr.ac.ync.library.domain.reviews.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ReviewResponse {

    private Long id;
    private Long bookId;
    private String bookTitle;
    private Long userId;
    private String username;
    private String title;
    private String comment;
    private Long rating;
    private String imageUrl;
    private LocalDateTime createdDateTime;
}
