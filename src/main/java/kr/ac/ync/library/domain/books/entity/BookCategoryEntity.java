package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_book_category")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class BookCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
