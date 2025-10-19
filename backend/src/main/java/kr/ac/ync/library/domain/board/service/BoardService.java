package kr.ac.ync.library.domain.board.service;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {
    Page<BoardResponse> getAllBoards(String keyword, String searchType, String category, Pageable pageable);
    BoardResponse getBoard(Long id);
    BoardResponse createBoard(BoardRequest request, UserEntity user);
    BoardResponse updateBoard(Long id, BoardRequest request, UserEntity user);
    void deleteBoard(Long id, UserEntity user);
    void incrementViewCount(Long id);

    // ✅ 추가
    long getMaxBoardId();
}
