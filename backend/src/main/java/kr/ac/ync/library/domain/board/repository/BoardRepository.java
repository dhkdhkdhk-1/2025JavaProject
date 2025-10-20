package kr.ac.ync.library.domain.board.repository;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    // ✅ 카테고리만
    Page<BoardEntity> findByType(String type, Pageable pageable);

    // ✅ 제목 검색
    Page<BoardEntity> findByTitleContaining(String title, Pageable pageable);

    // ✅ 제목 + 내용 검색
    Page<BoardEntity> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    // ✅ 카테고리 + 제목 검색
    Page<BoardEntity> findByTypeAndTitleContaining(String type, String title, Pageable pageable);

    // ✅ 카테고리 + 제목+내용 검색
    Page<BoardEntity> findByTypeAndTitleContainingOrTypeAndContentContaining(
            String type1, String title,
            String type2, String content,
            Pageable pageable
    );

    // ✅ 추가: 작성자 검색
    Page<BoardEntity> findByUser_UsernameContaining(String username, Pageable pageable);

    // ✅ 추가: 카테고리 + 작성자 검색
    Page<BoardEntity> findByTypeAndUser_UsernameContaining(String type, String username, Pageable pageable);

    // ✅ 추가: 전체 게시글 중 가장 큰 id 조회
    Optional<BoardEntity> findTopByOrderByIdDesc();
}
