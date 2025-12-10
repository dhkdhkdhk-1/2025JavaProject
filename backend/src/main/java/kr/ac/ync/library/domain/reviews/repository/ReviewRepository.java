package kr.ac.ync.library.domain.reviews.repository;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    @Query("SELECT r FROM ReviewEntity r WHERE r.book.id = :bookId ORDER BY r.createdDateTime DESC")
    List<ReviewEntity> findTop6ByBookId(@Param("bookId") Long bookId, Pageable pageable);

    @Query("SELECT r FROM ReviewEntity r WHERE r.book.id = :bookId ORDER BY r.createdDateTime DESC")
    Page<ReviewEntity> findByBookIdPaged(@Param("bookId") Long bookId, Pageable pageable);

    @Query("SELECT r FROM ReviewEntity r JOIN FETCH r.book WHERE r.user.id = :userId ORDER BY r.createdDateTime DESC")
    List<ReviewEntity> findByUserId(@Param("userId") Long userId);

    boolean existsByBookAndUser(BookEntity book, UserEntity user);
}
