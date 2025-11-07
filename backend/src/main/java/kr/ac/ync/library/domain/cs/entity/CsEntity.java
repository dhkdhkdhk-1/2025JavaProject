package kr.ac.ync.library.domain.cs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.cs.entity.category.CsCategory;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_cs")
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CsEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    @NotBlank(message = "제목 입력")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "내용 입력")
    @Column(nullable = false)
    private String content;

    @NotBlank(message = "답변 입력")
    private String answerContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CsStatus status = CsStatus.WAITING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CsCategory csCategory;

}
