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
@Getter
@ToString
public class UserEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(value = EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    private boolean deleted;

}
