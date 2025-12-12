package kr.ac.ync.library.domain.board.repository;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    // 삭제되지 않은 글 + 탈퇴하지 않은 회원 글만 조회
    @Query("SELECT b FROM BoardEntity b WHERE b.deleted = false AND b.user.deleted = false")
    Page<BoardEntity> findAllVisible(Pageable pageable);

    // 카테고리별 조회
    Page<BoardEntity> findByType(String type, Pageable pageable);

    // 제목 검색
    Page<BoardEntity> findByTitleContaining(String title, Pageable pageable);

    // 제목 + 내용 검색
    Page<BoardEntity> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    // 타입 + 제목 검색
    Page<BoardEntity> findByTypeAndTitleContaining(String type, String title, Pageable pageable);

    // 타입 + 제목 또는 내용 검색
    Page<BoardEntity> findByTypeAndTitleContainingOrTypeAndContentContaining(
            String type1, String title, String type2, String content, Pageable pageable);

    // 작성자 검색
    Page<BoardEntity> findByUser_UsernameContaining(String username, Pageable pageable);

    // 타입 + 작성자 검색
    Page<BoardEntity> findByTypeAndUser_UsernameContaining(String type, String username, Pageable pageable);

    // 가장 최신 글 1개
    Optional<BoardEntity> findTopByOrderByIdDesc();

    // 최신 공지 3개 (홈페이지용)
    List<BoardEntity> findTop3ByTypeAndDeletedFalseAndUser_DeletedFalseOrderByIdDesc(String type);


    // 특정 유저의 게시글 숨김/복구
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE BoardEntity b SET b.deleted = :deleted WHERE b.user.id = :userId")
    void updateDeletedByUserId(@Param("userId") Long userId, @Param("deleted") boolean deleted);

    // 특정 유저가 작성한 게시글의 작성자명 일괄 변경
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE BoardEntity b SET b.user.username = :newName WHERE b.user.id = :userId")
    void updateUsernameByUserId(@Param("userId") Long userId, @Param("newName") String newName);

    //게시글 작성 여부
    boolean existsByUser_Id(Long userId);

}
