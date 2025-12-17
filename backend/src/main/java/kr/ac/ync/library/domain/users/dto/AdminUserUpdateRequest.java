package kr.ac.ync.library.domain.users.dto;

import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserUpdateRequest {
    private String username;
    private String email;
    private UserRole role;
    private Long branchId;
}

