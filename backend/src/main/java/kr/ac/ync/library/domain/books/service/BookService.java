package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {

    BookResponse register(BookRegisterRequest request);

    BookResponse modify(BookModRequest request);

    void remove(Long id);

    BookResponse get(Long id);

    List<BookResponse> getList();

    Page<BookResponse> getList(Pageable pageable);
}
