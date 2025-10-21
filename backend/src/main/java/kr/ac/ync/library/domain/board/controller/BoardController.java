package kr.ac.ync.library.domain.board.controller;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.service.BoardService;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
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

    /** ✅ 검색 + 분류 + 페이징 + maxId 포함 */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBoards(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "searchType", required = false, defaultValue = "제목+내용") String searchType,
            @RequestParam(value = "category", required = false, defaultValue = "전체") String category
    ) {
        if (size > 50) size = 50;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<BoardResponse> boardPage = boardService.getAllBoards(keyword, searchType, category, pageable);
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
}
