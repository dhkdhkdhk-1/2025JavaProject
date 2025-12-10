package kr.ac.ync.library.domain.cs.dto;

import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CsAdminListResponse {
    private Long id;
    private String title;
    private CsCategory csCategory;
    private CsStatus csStatus;
    private LocalDateTime createdAt;

    private Long userId;
    private String username;
    private String email;

    private Long branchId;
    private String branchName;
}