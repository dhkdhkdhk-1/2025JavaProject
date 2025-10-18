package kr.ac.ync.library.domain.board.service;

import jakarta.transaction.Transactional;
import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    /**
     * ✅ 게시판 전체 목록 (페이징 + ID 내림차순)
     */
    @Override
    public Page<BoardResponse> getAllBoards(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        return boardRepository.findAll(sortedPageable)
                .map(this::toResponse);
    }

    /**
     * ✅ 게시글 단건 조회
     */
    @Override
    public BoardResponse getBoard(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return toResponse(entity);
    }

    /**
     * ✅ 게시글 작성
     */
    @Override
    public BoardResponse createBoard(BoardRequest request, UserEntity user) {
        BoardEntity board = BoardEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType() != null ? request.getType() : "일반")
                .user(user)
                .viewCount(0L)
                .build();

        return toResponse(boardRepository.save(board));
    }

    /**
     * ✅ 게시글 수정
     */
    @Override
    public BoardResponse updateBoard(Long id, BoardRequest request) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setType(request.getType() != null ? request.getType() : "일반");

        return toResponse(boardRepository.save(board));
    }

    /**
     * ✅ 게시글 삭제
     */
    @Override
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    /**
     * ✅ 게시글 조회수 증가 (비회원 가능)
     */
    @Override
    public void incrementViewCount(Long id) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);
    }

    /**
     * ✅ Entity → DTO 변환
     */
    private BoardResponse toResponse(BoardEntity entity) {
        return BoardResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .type(entity.getType())
                .username(entity.getUser() != null ? entity.getUser().getUsername() : "알 수 없음")
                .viewCount(entity.getViewCount() == null ? 0L : entity.getViewCount())
                .createdAt(entity.getCreatedDateTime())
                .modifiedAt(entity.getModifiedDateTime())
                .build();
    }
}
