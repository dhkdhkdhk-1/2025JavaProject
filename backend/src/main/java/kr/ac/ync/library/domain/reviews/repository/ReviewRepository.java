package kr.ac.ync.library.domain.reviews.repository;

import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    @Query("SELECT r FROM ReviewEntity r WHERE r.book.id = :bookId")
    List<ReviewEntity> findByBookId(@Param("bookId") Long bookId);
}
