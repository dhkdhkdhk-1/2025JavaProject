package kr.ac.ync.library.domain.board.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_inquiry")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class InquiryEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 1000)
    private String question;

    @Column(nullable = false, length = 1000)
    private String answer;

    @Column(nullable = false, length = 1000)
    private String status;

    @Column(nullable = false)
    private String category;

    private int i;
}
