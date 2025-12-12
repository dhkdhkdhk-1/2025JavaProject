package kr.ac.ync.library.domain.board.controller;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.board.service.BoardService;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    /** ✅ 검색 + 분류 + 페이징 + maxId + 게시판 타입(일반/공지) 구분 */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBoards(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "searchType", required = false, defaultValue = "제목+내용") String searchType,
            @RequestParam(value = "category", required = false, defaultValue = "전체") String category,
            @RequestParam(value = "type", required = false) String boardTypeFromFront   // "掲示板" / "告知"
    ) {
        if (size > 50) size = 50;
        if (page < 0) page = 0;

        // ⭐ 프론트에서 "掲示板" / "告知" 로 오기 때문에 내부적으로 general / notice 로 변환
        String internalBoardType;
        if ("告知".equals(boardTypeFromFront)) {
            internalBoardType = "notice";   // 공지 게시판
        } else {
            // null, "掲示板", 그 외 값 → 전부 일반 게시판 취급
            internalBoardType = "general";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<BoardResponse> boardPage =
                boardService.getAllBoards(keyword, searchType, category, internalBoardType, pageable);
        long maxId = boardService.getMaxBoardId();

        Map<String, Object> result = new HashMap<>();
        result.put("content", boardPage.getContent());
        result.put("totalPages", boardPage.getTotalPages());
        result.put("totalElements", boardPage.getTotalElements());
        result.put("maxId", maxId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable("id") Long id) {
        BoardResponse board = boardService.getBoard(id);
        if (board == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(board);
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BoardRequest request
    ) {
        var userEntity = UserMapper.toEntity(userDetails.getUser());
        BoardResponse created = boardService.createBoard(request, userEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BoardRequest request
    ) {
        var userEntity = UserMapper.toEntity(userDetails.getUser());
        BoardResponse updated = boardService.updateBoard(id, request, userEntity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        var userEntity = UserMapper.toEntity(userDetails.getUser());
        boardService.deleteBoard(id, userEntity);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable("id") Long id) {
        boardService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notice/top3") // 메인페이지에 공지 3개 끌어오기
    public List<BoardResponse> getLatestNotice() {
        return boardService.getLatestNotices();
    }

    @GetMapping("/has-post/{email}")
    public ResponseEntity<Boolean> hasPost(@PathVariable String email) {
        var user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.ok(false);
        }

        boolean exists = boardRepository.existsByUser_Id(user.getId());

        return ResponseEntity.ok(exists);
    }

}
