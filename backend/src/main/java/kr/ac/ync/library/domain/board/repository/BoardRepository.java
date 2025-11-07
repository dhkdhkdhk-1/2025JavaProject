package kr.ac.ync.library.domain.board.repository;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    // ✅ 삭제되지 않은 게시글만 (유저도 탈퇴X)
    @Query("SELECT b FROM BoardEntity b WHERE b.deleted = false AND b.user.deleted = false")
    Page<BoardEntity> findAllVisible(Pageable pageable);

    Page<BoardEntity> findByType(String type, Pageable pageable);
    Page<BoardEntity> findByTitleContaining(String title, Pageable pageable);
    Page<BoardEntity> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
    Page<BoardEntity> findByTypeAndTitleContaining(String type, String title, Pageable pageable);
    Page<BoardEntity> findByTypeAndTitleContainingOrTypeAndContentContaining(
            String type1, String title, String type2, String content, Pageable pageable);
    Page<BoardEntity> findByUser_UsernameContaining(String username, Pageable pageable);
    Page<BoardEntity> findByTypeAndUser_UsernameContaining(String type, String username, Pageable pageable);
    Optional<BoardEntity> findTopByOrderByIdDesc();

    // ✅ user_id 기준 게시글 숨김/복구
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE BoardEntity b SET b.deleted = :deleted WHERE b.user.id = :userId")
    void updateDeletedByUserId(@Param("userId") Long userId, @Param("deleted") boolean deleted);

    // ✅ user_id 기준 닉네임 갱신
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE BoardEntity b SET b.user.username = :newName WHERE b.user.id = :userId")
    void updateUsernameByUserId(@Param("userId") Long userId, @Param("newName") String newName);
}
