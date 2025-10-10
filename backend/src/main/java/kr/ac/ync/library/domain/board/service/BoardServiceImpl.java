package kr.ac.ync.library.domain.board.service;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;

import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    @Override
    public List<BoardEntity> getAllBoards() {
        return boardRepository.findAll();
    }

    @Override
    public BoardEntity getBoard(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    @Override
    public BoardEntity createBoard(BoardEntity board) {
        return boardRepository.save(board);
    }

    @Override
    public BoardEntity updateBoard(Long id, BoardEntity updatedBoard, UserEntity currentUser) {
        BoardEntity existing = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 작성자 이메일 또는 관리자/매니저만 수정 가능
        if (!existing.getUser().getEmail().equals(currentUser.getEmail())
                && currentUser.getRole() != UserRole.ADMIN
                && currentUser.getRole() != UserRole.MANAGER) {
            throw new RuntimeException("권한이 없습니다.");
        }

        existing = BoardEntity.builder()
                .id(existing.getId())
                .user(existing.getUser())
                .type(updatedBoard.getType())
                .title(updatedBoard.getTitle())
                .content(updatedBoard.getContent())
                .viewCount(existing.getViewCount())
                .build();

        return boardRepository.save(existing);
    }

    @Override
    public void deleteBoard(Long id, UserEntity currentUser) {
        BoardEntity existing = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 작성자 이메일 또는 관리자/매니저만 삭제 가능
        if (!existing.getUser().getEmail().equals(currentUser.getEmail())
                && currentUser.getRole() != UserRole.ADMIN
                && currentUser.getRole() != UserRole.MANAGER) {
            throw new RuntimeException("권한이 없습니다.");
        }

        boardRepository.delete(existing);
    }

    @Override
    public List<BoardEntity> getBoardsByTypeAndTitle(String type, String title) {
        return boardRepository.findByTypeAndTitleContaining(type, title);
    }

}
