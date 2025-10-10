package kr.ac.ync.library.domain.reviews.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRegisterRequest
{
    @NotEmpty(message = "리뷰 제목 입력")
    private String title;

    @NotEmpty(message = "리뷰 내용 입력")
    private String comment;

    @NotNull(message = "별점 입력")
    private Long rating;
}
