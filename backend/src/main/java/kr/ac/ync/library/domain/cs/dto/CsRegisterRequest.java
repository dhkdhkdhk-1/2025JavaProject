package kr.ac.ync.library.domain.cs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CsRegisterRequest {
    @NotNull
    private Long branchId;

    @NotBlank(message = "")
    private String title;

    @NotBlank(message = "")
    private String content;

    @NotNull
    private CsCategory category;
}
