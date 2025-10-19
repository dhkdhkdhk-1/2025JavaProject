package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    /** ✅ Book ↔ BookBranch (1:N 관계) */
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<BookBranchEntity> bookBranches = new ArrayList<>();

    /** ✅ 리뷰 관계 */
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews = new ArrayList<>();

    // ====== 편의 메서드 ======
    public void uptCategory(BookCategory category) { this.category = category; }
    public void uptTitle(String title) { this.title = title; }
    public void uptAuthor(String author) { this.author = author; }
    public void uptPublisher(String publisher) { this.publisher = publisher; }
    public void markAsBorrowed() { this.available = false; }
    public void markAsReturned() { this.available = true; }

    /** ✅ BookBranch 연결 */
    public void addBranchRelation(BookBranchEntity relation) {
        this.bookBranches.add(relation);
    }

    public void removeBranchRelation(BookBranchEntity relation) {
        this.bookBranches.remove(relation);
    }

    // BookEntity.java 하단부 (기존 uptTitle, uptAuthor 바로 아래에 추가)
    public void uptDescription(String description) {
        this.description = description;
    }

    public void uptImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
