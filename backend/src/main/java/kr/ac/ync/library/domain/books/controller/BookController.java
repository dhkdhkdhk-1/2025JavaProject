package kr.ac.ync.library.domain.books.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book")
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

    @GetMapping("/list")
    public ResponseEntity<List<BookResponse>> list() {
        return ResponseEntity.ok(bookService.getList());
    }

    @GetMapping //책 목록 보여줄때 한줄에 5개씩 총 3줄(15개)씩 띄우기 위해 쓴 코드
    public ResponseEntity<Page<BookResponse>> listPage(
            @PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(bookService.getList(pageable));
    }
}
