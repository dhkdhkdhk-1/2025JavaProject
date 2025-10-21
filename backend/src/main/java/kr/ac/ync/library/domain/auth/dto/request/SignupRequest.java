package kr.ac.ync.library.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @NotBlank(message = "아이디(이메일)를 입력해주세요.")
    @Email(message = "아이디는 이메일 형식이어야 합니다.")
    private String email;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String username;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;

    @NotBlank(message = "비밀번호를 한번 더 입력해주십시오.")
    private String passwordCheck;

    private boolean restorePosts; // ✅ 게시글 복원 여부
}
