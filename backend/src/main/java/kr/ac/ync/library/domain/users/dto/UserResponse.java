package kr.ac.ync.library.domain.users.dto;

import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
}
