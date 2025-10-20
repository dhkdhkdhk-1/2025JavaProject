package kr.ac.ync.library.domain.users.dto;

import jakarta.validation.constraints.NotBlank;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserUpdateRequest {
    @NotBlank
    private String username;
}
