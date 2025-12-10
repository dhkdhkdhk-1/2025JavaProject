package kr.ac.ync.library.domain.wishlist.repository;

import kr.ac.ync.library.domain.wishlist.entity.WishlistEntity;
import kr.ac.ync.library.domain.wishlist.entity.WishlistId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistEntity, WishlistId> {

    List<WishlistEntity> findByUser_Id(Long userId); // ✅ 기존 목록 조회

    boolean existsByUser_IdAndBook_Id(Long userId, Long bookId);

    void deleteByUser_IdAndBook_Id(Long userId, Long bookId);

    Page<WishlistEntity> findByUser_Id(Long userId, Pageable pageable);
}
