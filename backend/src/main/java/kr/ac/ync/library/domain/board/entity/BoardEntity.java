package kr.ac.ync.library.domain.board.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_lib_board")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@ToString
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BoardEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String content;

    private Long viewCount;

    /** ✅ 게시글 soft delete 플래그 (DB에 남기지만 표시 안 함) */
    @Column(nullable = false)
    private boolean deleted = false;
}