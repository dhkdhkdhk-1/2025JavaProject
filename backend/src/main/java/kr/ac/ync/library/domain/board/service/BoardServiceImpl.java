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

    private static final List<String> NOTICE_TYPES = List.of("告知", "入荷", "行事");

    @Override
    public Page<BoardResponse> getAllBoards(
            String keyword,
            String searchType,
            String category,
            String boardType,
            Pageable pageable
    ) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Page<BoardEntity> pageResult;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null &&
                !"전체".equals(category) &&
                !"すべて".equals(category);

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

                default:
                    pageResult = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, sortedPageable);
                    break;
            }
        } else if (hasCategory) {
            pageResult = boardRepository.findByType(category, sortedPageable);
        } else {
            pageResult = boardRepository.findAllVisible(sortedPageable);
        }

        List<BoardResponse> list = pageResult.getContent().stream()
                .map(BoardMapper::toResponse)
                .toList();

        boolean isNoticeBoard = "notice".equals(boardType);

        List<BoardResponse> filteredByBoardType = list.stream()
                .filter(b -> {
                    String type = b.getType();
                    boolean isNoticeType = type != null && NOTICE_TYPES.contains(type);
                    return isNoticeBoard ? isNoticeType : !isNoticeType;
                })
                .toList();

        return new PageImpl<>(filteredByBoardType, pageable, filteredByBoardType.size());
    }

    @Override
    public BoardResponse getBoard(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (Boolean.TRUE.equals(entity.getDeleted()) ||
                (entity.getUser() != null && Boolean.TRUE.equals(entity.getUser().getDeleted()))) {

            throw new RuntimeException("삭제되었거나 탈퇴한 회원의 게시글은 볼 수 없습니다.");
        }

        return BoardMapper.toResponse(entity);
    }

    @Override
    public BoardResponse createBoard(BoardRequest request, UserEntity user) {
        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("제목과 내용을 모두 입력해야 합니다.");
        }
        BoardEntity board = BoardMapper.toEntity(request, user);
        return BoardMapper.toResponse(boardRepository.save(board));
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

        board.setTitle(request.getTitle().trim());
        board.setContent(request.getContent().trim());
        board.setType(request.getType() != null ? request.getType() : "일반");

        return BoardMapper.toResponse(boardRepository.save(board));
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

        board.setDeleted(true);
        boardRepository.save(board);
    }

    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        if (!boardRepository.existsById(id)) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
        boardRepository.increaseViewCount(id);
    }

    @Override
    public long getMaxBoardId() {
        return boardRepository.findTopByOrderByIdDesc()
                .map(BoardEntity::getId)
                .orElse(0L);
    }

    @Override
    public List<BoardResponse> getLatestNotices() {
        List<BoardEntity> notices =
                boardRepository.findTop3ByTypeAndDeletedFalseAndUser_DeletedFalseOrderByIdDesc("告知");

        return notices.stream()
                .map(BoardMapper::toResponse)
                .toList();
    }
}
