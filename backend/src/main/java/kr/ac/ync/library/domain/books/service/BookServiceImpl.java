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

    @Override // 책 한페이지에 한줄에 5개 3줄 총 15개 띄우기 위한 코드
    public Page<BookResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(9).withPage(pageable.getPageNumber());

        // DB 조회
        Page<BookEntity> page = bookRepository.findAll(fixedPageable);

        // 엔티티 -> DTO 변환
        List<BookResponse> responses = page.getContent().stream()
                .map(BookMapper::toResponse)
                .toList();

        // Page<BookResponse> 반환
        return new PageImpl<>(responses, fixedPageable, page.getTotalElements());
    }
}
