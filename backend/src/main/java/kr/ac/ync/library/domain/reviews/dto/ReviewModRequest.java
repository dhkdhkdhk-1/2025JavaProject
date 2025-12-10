package kr.ac.ync.library.domain.reviews.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewModRequest {

    private Long id;
    private String title;
    private String comment;
    private Long rating;
}
