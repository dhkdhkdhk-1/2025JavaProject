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

    BookResponse modify(BookModRequest request, MultipartFile image) throws IOException;

    void remove(Long id);

    BookResponse get(Long id);

    List<BookResponse> getList();

    Page<BookResponse> getList(Pageable pageable);

    /** ✅ 장르 + 검색어 필터 포함 목록 조회 */
    Page<BookResponse> getList(Pageable pageable, String keyword, List<BookCategory> genres);

    List<Map<String, Object>> getBookBranchStatus(Long bookId);
}
