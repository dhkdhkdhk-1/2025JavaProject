package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface BookService {


    BookResponse register(BookRegisterRequest request, MultipartFile image) throws IOException;

    BookResponse modify(Long id, BookModRequest request, MultipartFile image) throws IOException;

    void remove(Long id);

    BookResponse get(Long id);

    List<BookResponse> getList();

    Page<BookResponse> getList(Pageable pageable);

    Page<BookResponse> getList(Pageable pageable, String keyword, List<BookCategory> genres);

    List<Map<String, Object>> getBookBranchStatus(Long bookId);

    // ✅ 추가: 지점별 대여 가능 여부 변경
    void updateBookBranchAvailability(Long bookId, Long branchId, boolean available);
}
