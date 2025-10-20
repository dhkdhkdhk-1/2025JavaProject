package kr.ac.ync.library.domain.board.service;

import jakarta.transaction.Transactional;
import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    /** ✅ 검색, 분류, 페이징 */
    @Override
    public Page<BoardResponse> getAllBoards(String keyword, String searchType, String category, Pageable pageable) {

        // ✅ 명시적으로 DB 정렬을 "id DESC"로 고정
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<BoardEntity> pageResult;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null && !"전체".equals(category);

        if (hasKeyword && hasCategory) {
            if ("제목".equals(searchType)) {
                pageResult = boardRepository.findByTypeAndTitleContaining(category, keyword, sortedPageable);
            } else {
                pageResult = boardRepository.findByTypeAndTitleContainingOrTypeAndContentContaining(
                        category, keyword, category, keyword, sortedPageable
                );
            }
        } else if (hasKeyword) {
            if ("제목".equals(searchType)) {
                pageResult = boardRepository.findByTitleContaining(keyword, sortedPageable);
            } else {
                pageResult = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, sortedPageable);
            }
        } else if (hasCategory) {
            pageResult = boardRepository.findByType(category, sortedPageable);
        } else {
            pageResult = boardRepository.findAll(sortedPageable);
        }

        // ✅ 그대로 반환 (정렬된 상태 유지)
        return pageResult.map(this::toResponse);
    }

    @Override
    public BoardResponse getBoard(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return toResponse(entity);
    }

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

    @Override
    public BoardResponse updateBoard(Long id, BoardRequest request, UserEntity user) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getUser().getId().equals(user.getId()) &&
                user.getRole() != UserRole.MANAGER &&
                user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setType(request.getType() != null ? request.getType() : "일반");
        return toResponse(boardRepository.save(board));
    }

    @Override
    public void deleteBoard(Long id, UserEntity user) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!board.getUser().getId().equals(user.getId()) &&
                user.getRole() != UserRole.MANAGER &&
                user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        boardRepository.delete(board);
    }

    @Override
    public void incrementViewCount(Long id) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);
    }

    /** ✅ 전체 게시글 중 가장 큰 ID 반환 */
    @Override
    public long getMaxBoardId() {
        return boardRepository.findTopByOrderByIdDesc()
                .map(BoardEntity::getId)
                .orElse(0L);
    }

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
