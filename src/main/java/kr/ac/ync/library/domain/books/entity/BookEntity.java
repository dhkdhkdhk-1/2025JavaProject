package kr.ac.ync.library.domain.books.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branchEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private BookCategoryEntity category;

    @Column(nullable = false)
    private String title;

    private String description;

    private String author;

    private String publisher;

    @Column(nullable = false)
    private Long totalQuantity;

    @Column(nullable = false)
    private Long availableQuantity;

    private LocalDateTime createdDateTime;
}
