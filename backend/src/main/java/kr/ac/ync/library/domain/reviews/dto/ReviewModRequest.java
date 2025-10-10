package kr.ac.ync.library.domain.reviews.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewModRequest
{
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Long userId;
    private String username;
    private String title;
    private String comment;
    private Long rating;
    private LocalDateTime createdDateTime;
}
