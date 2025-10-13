package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
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

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    public void uptCategory(BookCategory category) {
        this.category = category;
    }

    public void uptTitle(String title) {
        this.title = title;
    }

    public void uptAuthor(String author) {
        this.author = author;
    }

    public void uptPublisher(String publisher) {
        this.publisher = publisher;
    }

    public void markAsBorrowed() {
        this.available = false;
    }

    public void markAsReturned() {
        this.available = true;
    }

    public void uptBranch(BranchEntity branch) {
        this.branch = branch;
    }
}
