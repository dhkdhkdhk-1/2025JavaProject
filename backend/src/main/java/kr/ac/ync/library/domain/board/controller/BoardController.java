package kr.ac.ync.library.domain.board.controller;

import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.board.service.BoardService;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardEntity>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardEntity> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoard(id));
    }

    @PostMapping
    public ResponseEntity<BoardEntity> createBoard(@RequestBody BoardEntity board) {
        return ResponseEntity.ok(boardService.createBoard(board));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardEntity> updateBoard(@PathVariable Long id,
                                                   @RequestBody BoardEntity updatedBoard,
                                                   @RequestBody UserEntity currentUser) {
        return ResponseEntity.ok(boardService.updateBoard(id, updatedBoard, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id, @RequestBody UserEntity currentUser) {
        boardService.deleteBoard(id, currentUser);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    @GetMapping("/search")
    public ResponseEntity<List<BoardEntity>> searchBoards(
            @RequestParam String type,
            @RequestParam String title) {
        return ResponseEntity.ok(boardService.getBoardsByTypeAndTitle(type, title));
    }
}
