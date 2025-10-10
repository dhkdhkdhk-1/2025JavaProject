package kr.ac.ync.library.domain.branch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BranchRegisterRequest {
    @NotBlank(message = "지점 이름을 입력해주세요.")
    private String name;
    @NotBlank(message = "지점 위치를 입력해주세요.")
    private String location;
}
