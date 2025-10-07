package kr.ac.ync.library.domain.wishlist.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_wishlist")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistEntity extends BaseTimeEntity {

    @EmbeddedId
    private WishlistId id;

    @MapsId("userId")  // WishlistId의 user 필드와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @MapsId("bookId")  // WishlistId의 book 필드와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

}
