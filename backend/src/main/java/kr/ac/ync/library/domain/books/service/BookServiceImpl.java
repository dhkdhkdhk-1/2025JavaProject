package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.exception.BranchNotFoundException;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;

    @Override
    public BookResponse register(BookRegisterRequest request) {
        BranchEntity branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> BranchNotFoundException.EXCEPTION);

        BookEntity entity = BookMapper.toEntity(request);
        entity.uptBranch(branch);

        return BookMapper.toResponse(bookRepository.save(entity));
    }

    @Override
    public BookResponse modify(BookModRequest request) {
        BookEntity book = bookRepository.findById(request.getId())
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        book.uptTitle(request.getTitle());
        book.uptCategory(request.getCategory());
        book.uptAuthor(request.getAuthor());
        book.uptPublisher(request.getPublisher());

        if (request.isAvailable()) book.markAsReturned();
        else book.markAsBorrowed();

        BranchEntity branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> BranchNotFoundException.EXCEPTION);
        book.uptBranch(branch);

        return BookMapper.toResponse(bookRepository.save(book));
    }

    @Override
    public void remove(Long id) {
        bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION);
        bookRepository.deleteById(id);
    }

    @Override
    public BookResponse get(Long id) {
        return BookMapper.toResponse(
                bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION)
        );
    }

    @Override
    public List<BookResponse> getList() {
        return bookRepository.findAll()
                .stream()
                .map(BookMapper::toResponse)
                .toList();
    }

    @Override // 책 한 페이지당 9개(3줄 x 3개)
    public Page<BookResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(9).withPage(pageable.getPageNumber());
        Page<BookEntity> page = bookRepository.findAll(fixedPageable);

        // Page<BookEntity> → Page<BookResponse>
        return page.map(BookMapper::toResponse);
    }
}

