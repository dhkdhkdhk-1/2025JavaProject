package kr.ac.ync.library.domain.board.controller;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.service.BoardService;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    // ✅ 게시판 목록
    @GetMapping
    public ResponseEntity<Page<BoardResponse>> getAllBoards(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        if (size > 50) size = 50;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(boardService.getAllBoards(pageable));
    }

    // ✅ 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable("id") Long id) {
        BoardResponse board = boardService.getBoard(id);
        if (board == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(board);
    }

    // ✅ 게시글 작성 (로그인 필요)
    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BoardRequest request
    ) {
        var userEntity = UserMapper.toEntity(userDetails.getUser());
        BoardResponse created = boardService.createBoard(request, userEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ✅ 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable("id") Long id,
            @RequestBody BoardRequest request
    ) {
        BoardResponse updated = boardService.updateBoard(id, request);
        return ResponseEntity.ok(updated);
    }

    // ✅ 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable("id") Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ (신규 추가) 게시글 조회수 증가 API — 비회원 허용
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable("id") Long id) {
        boardService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
}
