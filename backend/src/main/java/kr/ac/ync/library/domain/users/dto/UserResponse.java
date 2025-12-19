package kr.ac.ync.library.domain.users.dto;

import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor      // ✅ 모든 필드를 받는 생성자 자동 생성
@NoArgsConstructor       // ✅ 기본 생성자 자동 생성
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private Boolean deleted;

    // ✅ Entity → DTO 변환용 생성자 추가
    public UserResponse(UserEntity user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.deleted = user.getDeleted();
    }
}
