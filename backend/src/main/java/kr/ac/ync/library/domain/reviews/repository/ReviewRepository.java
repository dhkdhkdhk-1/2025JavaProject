package kr.ac.ync.library.domain.reviews.repository;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    @Query("SELECT r FROM ReviewEntity r WHERE r.book.id = :bookId")
    List<ReviewEntity> findByBookId(@Param("bookId") Long bookId);

    // ✅ 로그인한 사용자의 리뷰 목록
    @Query("SELECT r FROM ReviewEntity r JOIN FETCH r.book WHERE r.user.id = :userId ORDER BY r.createdDateTime DESC")
    List<ReviewEntity> findByUserId(@Param("userId") Long userId);

    boolean existsByBookAndUser(BookEntity book, UserEntity user);
}
