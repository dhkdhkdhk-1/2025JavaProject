package kr.ac.ync.library.domain.cs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CsAdminAnswerRequest {
    @NotBlank(message = "답변 내용을 입력해주세요.")
    private String answerContent;
}
