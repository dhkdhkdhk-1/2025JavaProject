package kr.ac.ync.library.domain.books.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookResponse> register(@Valid @RequestBody BookRegisterRequest request) {
        return ResponseEntity.ok(bookService.register(request));
    }

    @PutMapping
    public ResponseEntity<BookResponse> modify(@Valid @RequestBody BookModRequest request) {
        return ResponseEntity.ok(bookService.modify(request));
    }

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        bookService.remove(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ 숫자만 매칭되게 해서 /book/recent, /book/list 와 충돌 방지
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<BookResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.get(id));
    }

    /** 목록: 프론트 page/size 사용 + 서버 가드 */
    @GetMapping("/list")
    public ResponseEntity<Page<BookResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword // 필요 시 서비스에서 사용
    ) {
        int maxSize = 50;
        int safeSize = Math.min(Math.max(size, 1), maxSize);

        Pageable pageable = PageRequest.of(page, safeSize, Sort.by(Sort.Direction.DESC, "createdDateTime"));
        return ResponseEntity.ok(bookService.getList(pageable));
    }

    /** 홈용 최신 N권: 기본 5권, 1~12로 가드 */
    @GetMapping("/recent")
    public ResponseEntity<List<BookResponse>> recent(@RequestParam(defaultValue = "5") int size) {
        int safe = Math.max(1, Math.min(size, 12));
        Pageable p = PageRequest.of(0, safe, Sort.by(Sort.Direction.DESC, "createdDateTime"));
        return ResponseEntity.ok(bookService.getList(p).getContent());
    }
}
