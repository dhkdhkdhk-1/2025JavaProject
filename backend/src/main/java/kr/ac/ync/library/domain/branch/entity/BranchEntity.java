package kr.ac.ync.library.domain.branch.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_branch")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class BranchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<BookBranchEntity> bookBranches = new ArrayList<>();

    // ====== 편의 메서드 ======
    public void addBookRelation(BookBranchEntity relation) {
        this.bookBranches.add(relation);
    }

    public void removeBookRelation(BookBranchEntity relation) {
        this.bookBranches.remove(relation);
    }
}
