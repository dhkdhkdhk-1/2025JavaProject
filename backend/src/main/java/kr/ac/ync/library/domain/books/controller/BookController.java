package kr.ac.ync.library.domain.books.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.domain.books.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookResponse> register(
            @RequestPart(value = "book") @Valid BookRegisterRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        return ResponseEntity.ok(bookService.register(request, image));
    }

    @PutMapping(value = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookResponse> modify(
            @PathVariable Long id,
            @RequestPart("book") @Valid BookModRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        System.out.println("request.branchIds = " + request.getBranchIds());
        return ResponseEntity.ok(bookService.modify(id,request, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable("id") Long id) {
        bookService.remove(id);
        return ResponseEntity.noContent().build();
    }

    // 지점별 책 상태 조회
    @GetMapping("/{id}/branches")
    public ResponseEntity<List<Map<String, Object>>> getBranchStatus(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookBranchStatus(id));
    }

    // ✅ 지점별 도서 대여 가능 / 불가능 토글
    @PatchMapping("/{bookId}/branches/{branchId}/availability")
    public ResponseEntity<Void> updateBranchAvailability(
            @PathVariable Long bookId,
            @PathVariable Long branchId,
            @RequestParam boolean available
    ) {
        bookService.updateBookBranchAvailability(bookId, branchId, available);
        return ResponseEntity.ok().build();
    }

    // ✅ 숫자만 매칭되게 해서 /book/recent, /book/list 와 충돌 방지
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<BookResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.get(id));
    }

    /** ✅ 도서 목록: 장르 필터 + 검색어 + 페이징 지원 */
    @GetMapping("/list")
    public ResponseEntity<Page<BookResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<BookCategory> genres // ✅ 장르 필터 추가
    ) {
        int maxSize = 50;
        int safeSize = Math.min(Math.max(size, 1), maxSize);

        Pageable pageable = PageRequest.of(page, safeSize, Sort.by(Sort.Direction.DESC, "createdDateTime"));
        return ResponseEntity.ok(bookService.getList(pageable, keyword, genres));
    }

    /** 홈용 최신 N권: 기본 5권, 1~12로 가드 */
    @GetMapping("/recent")
    public ResponseEntity<List<BookResponse>> recent(@RequestParam(defaultValue = "5") int size) {
        int safe = Math.max(1, Math.min(size, 12));
        Pageable pageable = PageRequest.of(0, safe, Sort.by(Sort.Direction.DESC, "createdDateTime"));
        return ResponseEntity.ok(bookService.getList(pageable).getContent());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleJson(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "JSON parse error"));
    }
}
