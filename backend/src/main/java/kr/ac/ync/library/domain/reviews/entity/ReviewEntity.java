package kr.ac.ync.library.domain.reviews.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "tbl_review",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"book_id", "user_id"}) // ✅ 같은 책에 같은 유저 리뷰 1개만 허용
        }
)
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class ReviewEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    private Long rating;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String comment;

}
