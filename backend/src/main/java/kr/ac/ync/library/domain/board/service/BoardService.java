package kr.ac.ync.library.domain.board.service;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BoardService {

    /** ✅ boardType 추가 (일반 / 공지 구분용) */
    Page<BoardResponse> getAllBoards(
            String keyword,
            String searchType,
            String category,
            String boardType,
            Pageable pageable
    );

    BoardResponse getBoard(Long id);
    BoardResponse createBoard(BoardRequest request, UserEntity user);
    BoardResponse updateBoard(Long id, BoardRequest request, UserEntity user);
    void deleteBoard(Long id, UserEntity user);
    void incrementViewCount(Long id);
    long getMaxBoardId();

    // 최신 공지 3개 가져오기
    List<BoardResponse> getLatestNotices();
}
