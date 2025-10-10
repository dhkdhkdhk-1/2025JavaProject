package kr.ac.ync.library.domain.reviews.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Review
{
    private Long id;
    private Long bookId;          // 리뷰 대상 책 ID
    private String bookTitle;     // 책 제목
    private Long userId;          // 작성자 ID
    private String username;      // 작성자 이름
    private String title;         // 리뷰 제목
    private String comment;       // 리뷰 내용
    private Long rating;          // 별점
    private LocalDateTime createdDateTime;
}
