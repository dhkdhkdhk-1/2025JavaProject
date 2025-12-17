package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import lombok.*;

@Entity
@Table(name = "tbl_book_branch",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"book_id", "branch_id"})
})
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@ToString
public class BookBranchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ✅ N:1 — Book
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    /**
     * ✅ N:1 — Branch
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    /**
     * ✅ 지점별 대여 가능 여부
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean available = true;


    // ===== 유틸 메서드 =====
    public static BookBranchEntity link(BookEntity book, BranchEntity branch, boolean available) {
        BookBranchEntity rel = new BookBranchEntity();
        rel.setBook(book);
        rel.setBranch(branch);
        rel.setAvailable(available);

        book.addBranchRelation(rel);

        return rel;
    }
}
