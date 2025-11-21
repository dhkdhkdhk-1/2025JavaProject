package kr.ac.ync.library.domain.cs.dto;

import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CsRequest {
    private Long id;
    private String title;
    private String content;
    private String answerContent;
    private CsStatus status;
    private CsCategory category;
    private LocalDateTime createdAt;
}
