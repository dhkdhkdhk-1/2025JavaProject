package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
        bookEntity.uptTitle(request.getTitle());
        bookEntity.uptCategory(request.getCategory());
        bookEntity.uptAuthor(request.getAuthor());
        bookEntity.uptPublisher(request.getPublisher());
        if(request.isAvailable())
            bookEntity.markAsReturned();
        else
            bookEntity.markAsBorrowed();
        return BookMapper.toResponse(bookRepository.save(bookEntity));
    }

    @Override
    public void remove(Long id) {
        bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION);
        bookRepository.deleteById(id);
    }

    @Override
    public BookResponse get(Long id) {
        return BookMapper.toResponse(bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION));
    }

    @Override
    public List<BookResponse> getList() {
        return bookRepository.findAll().stream().map(BookMapper::toResponse).toList();
    }

    // 변경 후 (size 강제 X)
    @Override
    public Page<BookResponse> getList(Pageable pageable) {
        Page<BookEntity> page = bookRepository.findAll(pageable);
        List<BookResponse> responses = page.getContent().stream()
                .map(BookMapper::toResponse)
                .toList();
        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }
}
