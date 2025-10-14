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
<<<<<<< HEAD
        return bookRepository.findAll()
                .stream()
=======

        return bookRepository.findAll().stream().map(BookMapper::toResponse).toList();
    }

    @Override // 책 한페이지에 한줄에 5개 3줄 총 15개 띄우기 위한 코드
    public Page<BookResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(9).withPage(pageable.getPageNumber());

        // DB 조회
        Page<BookEntity> page = bookRepository.findAll(fixedPageable);

        // 엔티티 -> DTO 변환
        List<BookResponse> responses = page.getContent().stream()
>>>>>>> 7d4910a5e1e2de52eb3f94b8b6fce669e3e2bea0
                .map(BookMapper::toResponse)
                .toList();

<<<<<<< HEAD
    @Override
    public Page<BookResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(9).withPage(pageable.getPageNumber());
        Page<BookEntity> page = bookRepository.findAll(fixedPageable);

        // ✅ 스트림 완료 (세미콜론 추가 및 반환 방식 수정)
        return page.map(BookMapper::toResponse);
=======
        // Page<BookResponse> 반환
        return new PageImpl<>(responses, fixedPageable, page.getTotalElements());
>>>>>>> 7d4910a5e1e2de52eb3f94b8b6fce669e3e2bea0
    }
}
