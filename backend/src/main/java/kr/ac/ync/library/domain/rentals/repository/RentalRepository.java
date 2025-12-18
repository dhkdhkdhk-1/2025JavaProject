package kr.ac.ync.library.domain.rentals.repository;

import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<RentalEntity, Long> {

    List<RentalEntity> findByUserId(Long userId);

    @Query("""
        SELECT r FROM RentalEntity r
        WHERE r.returned = false
        AND r.dueDate < CURRENT_TIMESTAMP
    """)
    List<RentalEntity> findOverdueRentals();

    // ✅ BookBranch 조회를 여기서 담당
    @Query("""
        SELECT bb
        FROM BookBranchEntity bb
        WHERE bb.book = :book
          AND bb.branch = :branch
    """)
    Optional<BookBranchEntity> findBookBranch(
            @Param("book") BookEntity book,
            @Param("branch") BranchEntity branch
    );

    @Query("""
    SELECT r
    FROM RentalEntity r
    WHERE r.user.id = :userId
      AND r.book.id = :bookId
      AND r.returned = true
    ORDER BY r.returnDate DESC
""")
    List<RentalEntity> findReturnedRentalsByUserAndBook(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId
    );

}
