package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService{
    private final BookRepository bookRepository;

    @Override
    public BookResponse register(BookRegisterRequest request) {
        BookEntity entity = BookMapper.toEntity(request);
        return BookMapper.toResponse(bookRepository.save(entity));
    }

    @Override
    public BookResponse modify(BookModRequest request) {
        BookEntity bookEntity = bookRepository.findById(request.getId()).orElseThrow(() -> BookNotFoundException.EXCEPTION);
        return null;
    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public BookResponse get(Long id) {
        return null;
    }

    @Override
    public List<BookResponse> getList() {
        return List.of();
    }
}
