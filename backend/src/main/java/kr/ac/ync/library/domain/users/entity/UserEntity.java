package kr.ac.ync.library.domain.users.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_users")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@ToString
public class UserEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(value = EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    public void changeUsername(String username) {
        if (username != null && !username.isBlank()) {
            this.username = username;
        }
    }

    // ✅ 비밀번호 변경
    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    // ✅ 권한 변경 (관리자 전용)
    public void changeRole(UserRole newRole) {
        if (newRole != null) {
            this.role = newRole;
        }
    }

}
