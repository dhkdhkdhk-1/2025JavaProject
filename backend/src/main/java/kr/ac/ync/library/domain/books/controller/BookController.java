package kr.ac.ync.library.domain.books.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book")
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버 허용
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        bookService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.get(id));
    }

    /** 목록: 프론트가 page/size를 넘기고, 서버는 기본값/정렬/최대값으로만 가드 */
    @GetMapping("/list")
    public ResponseEntity<Page<BookResponse>> list(
            @PageableDefault(size = 20, sort = "createdDateTime", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        // size 상한 가드 (과도한 요청 방지)
        int maxSize = 50;
        int safeSize = Math.min(Math.max(pageable.getPageSize(), 1), maxSize);

        // 정렬 기본값 가드
        Sort sort = pageable.getSort().isUnsorted()
                ? Sort.by(Sort.Direction.DESC, "createdDateTime")
                : pageable.getSort();

        Pageable safe = PageRequest.of(pageable.getPageNumber(), safeSize, sort);
        return ResponseEntity.ok(bookService.getList(safe));
    }

    /** 홈용 최신 N권: 기본 5권, 쿼리로 size 조절 가능 (1~12 사이 가드) */
    @GetMapping("/recent")
    public ResponseEntity<List<BookResponse>> recent(@RequestParam(defaultValue = "5") int size) {
        int safe = Math.max(1, Math.min(size, 12));
        Pageable p = PageRequest.of(0, safe, Sort.by(Sort.Direction.DESC, "createdDateTime"));
        return ResponseEntity.ok(bookService.getList(p).getContent());
    }
}
