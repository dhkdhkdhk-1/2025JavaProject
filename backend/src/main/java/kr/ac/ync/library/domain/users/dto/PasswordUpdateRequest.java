package kr.ac.ync.library.domain.users.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
public class PasswordUpdateRequest {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;
}
