package kr.ac.ync.library.domain.users.dto;

import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User
{

    private Long id;
    private String username;
    private String email;
    private String password;
    private String phone;
    private UserRole role;
}