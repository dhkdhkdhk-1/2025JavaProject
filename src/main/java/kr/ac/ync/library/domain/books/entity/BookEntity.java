package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

@Entity
@Table(name = "tbl_books")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class BookEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(value = EnumType.STRING)
    private BookCategory category;

    @Column(nullable = false)
    private String title;

    private String author;

    private String publisher;

    private boolean available;

    public void modify(String title, String author, String publisher, BookCategory category, boolean available) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.category = category;
        this.available = available;
    }

    public void markAsBorrowed() {
        this.available = false;
    }

    public void markAsReturned() {
        this.available = true;
    }

}
