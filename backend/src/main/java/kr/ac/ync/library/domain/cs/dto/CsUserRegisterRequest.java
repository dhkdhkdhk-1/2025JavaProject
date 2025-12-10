package kr.ac.ync.library.domain.cs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CsUserRegisterRequest {
    @NotNull(message = "지점을 선택해주세요.")
    private Long branchId;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    @NotNull(message = "카테고리를 선택해주세요.")
    private CsCategory category;
}
