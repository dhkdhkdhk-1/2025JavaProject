package kr.ac.ync.library.domain.cs.dto;

import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class CsDetailResponse {
    private Long id;
    private String title;
    private String content;
    private String answerContent;
    private Long branchId;
    private String branchName;
    private Long userId;
    private CsStatus status;
    private CsCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime answerCreatedAt;
}
