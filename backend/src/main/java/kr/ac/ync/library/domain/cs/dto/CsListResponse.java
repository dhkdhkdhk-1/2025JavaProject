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
public class CsListResponse {
    private Long id;
    private String title;
    private CsCategory csCategory;
    private CsStatus csStatus;
    private LocalDateTime createdAt;
}
