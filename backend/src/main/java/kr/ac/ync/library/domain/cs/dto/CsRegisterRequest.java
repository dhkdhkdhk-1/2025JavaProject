package kr.ac.ync.library.domain.cs.dto;

import jakarta.validation.constraints.NotBlank;
import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CsRegisterRequest {
    @NotBlank
    private Long branchId;

    @NotBlank(message = "")
    private String title;

    @NotBlank(message = "")
    private String content;

    @NotBlank
    private CsCategory category;



}
