package kr.ac.ync.library.domain.branch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class BranchModRequest {
    @NotNull(message = "지점 번호를 입력해주세요.")
    private Long id;
    @NotBlank(message = "지점 이름을 입력해주세요.")
    private String name;
    @NotBlank(message = "지점 위치를 입력해주세요.")
    private String location;
}
