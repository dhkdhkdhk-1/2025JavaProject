package kr.ac.ync.library.domain.books.controller;

import kr.ac.ync.library.domain.books.service.BookFavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book/favorite")
@RequiredArgsConstructor
public class BookFavoriteController {

    private final BookFavoriteService favoriteService;

    // ❤️ 찜 추가
    @PostMapping("/{bookId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long bookId) {
        favoriteService.addFavorite(bookId);
        return ResponseEntity.ok().build();
    }

    // 💔 찜 해제
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long bookId) {
        favoriteService.removeFavorite(bookId);
        return ResponseEntity.noContent().build();
    }

    // ✅ 사용자가 이미 찜했는지 여부
    @GetMapping("/{bookId}/check")
    public ResponseEntity<Boolean> checkFavorite(@PathVariable Long bookId) {
        boolean result = favoriteService.isFavorite(bookId);
        return ResponseEntity.ok(result);
    }
}
