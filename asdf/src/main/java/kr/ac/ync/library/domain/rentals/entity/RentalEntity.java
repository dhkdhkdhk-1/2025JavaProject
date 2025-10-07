package kr.ac.ync.library.domain.rentals.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_rental")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class RentalEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BranchEntity branch;

    private LocalDateTime rentalDate;

    private LocalDateTime dueDate;

    private LocalDateTime returnDate;

    private String status;

    private boolean returned;

    @PrePersist
    public void prePersist() {
        if (this.rentalDate == null) {
            this.rentalDate = LocalDateTime.now();
        }
        if (this.dueDate == null) {
            this.dueDate = this.rentalDate.plusDays(7); // 기본 7일 대여
        }
        if (this.status == null) {
            this.status = "대여중";
        }
    }
}
