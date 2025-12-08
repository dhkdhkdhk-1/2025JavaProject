package kr.ac.ync.library.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardResponse {
    private Long id;
    private String title;
    private String content;
    private String type;
    private String username;
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private boolean deleted;
}
