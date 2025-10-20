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
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    /** ✅ 검색, 분류, 페이징 */
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

        // ✅ 검색 조건 분기
        if (hasKeyword && hasCategory) {
            switch (searchType) {
                case "제목":
                    pageResult = boardRepository.findByTypeAndTitleContaining(category, keyword, sortedPageable);
                    break;
                case "작성자":
                    pageResult = boardRepository.findByTypeAndUser_UsernameContaining(category, keyword, sortedPageable);
                    break;
                case "제목+내용":
                default:
                    pageResult = boardRepository.findByTypeAndTitleContainingOrTypeAndContentContaining(
                            category, keyword, category, keyword, sortedPageable
                    );
                    break;
            }
        } else if (hasKeyword) {
            switch (searchType) {
                case "제목":
                    pageResult = boardRepository.findByTitleContaining(keyword, sortedPageable);
                    break;
                case "작성자":
                    pageResult = boardRepository.findByUser_UsernameContaining(keyword, sortedPageable);
                    break;
                case "제목+내용":
                default:
                    pageResult = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, sortedPageable);
                    break;
            }
        } else if (hasCategory) {
            pageResult = boardRepository.findByType(category, sortedPageable);
        } else {
            // ✅ 탈퇴회원 글 제외된 게시글만 DB에서 바로 페이징
            pageResult = boardRepository.findAllActive(sortedPageable);
        }

        // ✅ Stream으로 변환 (응답 DTO)
        List<BoardResponse> responseList = pageResult
                .getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(responseList, pageable, pageResult.getTotalElements());
    }

    @Override
    public BoardResponse getBoard(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // ✅ 탈퇴 유저의 게시글 접근 차단
        if (entity.getUser() != null && entity.getUser().isDeleted()) {
            throw new RuntimeException("탈퇴한 회원의 게시글은 볼 수 없습니다.");
        }

        return toResponse(entity);
    }

    /** ✅ 제목·내용 검증 추가 */
    @Override
    public BoardResponse createBoard(BoardRequest request, UserEntity user) {
        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("제목과 내용을 모두 입력해야 합니다.");
        }

        BoardEntity board = BoardEntity.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .type(request.getType() != null ? request.getType() : "일반")
                .user(user)
                .viewCount(0L)
                .build();

        return toResponse(boardRepository.save(board));
    }

    /** ✅ 수정 시에도 검증 추가 */
    @Override
    public BoardResponse updateBoard(Long id, BoardRequest request, UserEntity user) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getUser().getId().equals(user.getId()) &&
                user.getRole() != UserRole.MANAGER &&
                user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("제목과 내용을 모두 입력해야 합니다.");
        }

        board.setTitle(request.getTitle().trim());
        board.setContent(request.getContent().trim());
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
