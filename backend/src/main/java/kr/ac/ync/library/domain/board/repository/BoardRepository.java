package kr.ac.ync.library.domain.board.repository;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {
    // 카테고리(type) + 제목(title) 검색
    List<BoardEntity> findByTypeAndTitleContaining(String type, String title);
}
