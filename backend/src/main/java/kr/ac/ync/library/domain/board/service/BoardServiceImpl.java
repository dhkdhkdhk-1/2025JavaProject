package kr.ac.ync.library.domain.board.service;

import jakarta.transaction.Transactional;
import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.board.mapper.BoardMapper;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    // ✅ 검색, 분류, 페이징 (DB에서 탈퇴회원/삭제글 자동 제외)
    @Override
    public Page<BoardResponse> getAllBoards(String keyword, String searchType, String category, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<BoardEntity> pageResult;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null && !"전체".equals(category);

        // ✅ 조건별 조회 (삭제된 글/탈퇴회원은 DB 레벨에서 이미 제외)
        if (hasKeyword && hasCategory) {
            switch (searchType) {
                case "제목":
                case "タイトル":
                    pageResult = boardRepository.findByTypeAndTitleContaining(category, keyword, sortedPageable);
                    break;

                case "작성자":
                case "投稿者":
                    pageResult = boardRepository.findByTypeAndUser_UsernameContaining(category, keyword, sortedPageable);
                    break;

                case "제목+내용":
                case "タイトル+内容":
                default:
                    pageResult = boardRepository.findByTypeAndTitleContainingOrTypeAndContentContaining(
                            category, keyword, category, keyword, sortedPageable
                    );
                    break;
            }
        } else if (hasKeyword) {
            switch (searchType) {
                case "제목":
                case "タイトル":
                    pageResult = boardRepository.findByTitleContaining(keyword, sortedPageable);
                    break;

                case "작성자":
                case "投稿者":
                    pageResult = boardRepository.findByUser_UsernameContaining(keyword, sortedPageable);
                    break;

                case "제목+내용":
                case "タイトル+内容":
                default:
                    pageResult = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, sortedPageable);
                    break;
            }
        } else if (hasCategory) {
            pageResult = boardRepository.findByType(category, sortedPageable);
        } else {
            // ✅ 모든 게시글 중 표시 가능한 글만
            pageResult = boardRepository.findAllVisible(sortedPageable);
        }

        List<BoardResponse> list = pageResult.getContent().stream()
                .map(BoardMapper::toResponse)
                .toList();


        return new PageImpl<>(list, pageable, pageResult.getTotalElements());
    }

    // ✅ 게시글 상세조회 (삭제/탈퇴회원 게시글 접근 차단)
    @Override
    public BoardResponse getBoard(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (entity.isDeleted() || (entity.getUser() != null && entity.getUser().isDeleted())) {
            throw new RuntimeException("삭제되었거나 탈퇴한 회원의 게시글은 볼 수 없습니다.");
        }

        return BoardMapper.toResponse(entity);
    }

    // ✅ 게시글 등록
    @Override
    public BoardResponse createBoard(BoardRequest request, UserEntity user) {
        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("제목과 내용을 모두 입력해야 합니다.");
        }
        BoardEntity board = BoardMapper.toEntity(request, user);
        return BoardMapper.toResponse(boardRepository.save(board));
    }

    // ✅ 수정
    @Override
    public BoardResponse updateBoard(Long id, BoardRequest request, UserEntity user) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getUser().getId().equals(user.getId()) &&
                user.getRole() != UserRole.MANAGER &&
                user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        board.setTitle(request.getTitle().trim());
        board.setContent(request.getContent().trim());
        board.setType(request.getType() != null ? request.getType() : "일반");

        return BoardMapper.toResponse(boardRepository.save(board));
    }

    // ✅ soft delete
    @Override
    public void deleteBoard(Long id, UserEntity user) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getUser().getId().equals(user.getId()) &&
                user.getRole() != UserRole.MANAGER &&
                user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        board.setDeleted(true);
        boardRepository.save(board);
    }

    // ✅ 조회수 증가
    @Override
    public void incrementViewCount(Long id) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);
    }

    // ✅ 최대 게시글 ID 반환
    @Override
    public long getMaxBoardId() {
        return boardRepository.findTopByOrderByIdDesc()
                .map(BoardEntity::getId)
                .orElse(0L);
    }
}
