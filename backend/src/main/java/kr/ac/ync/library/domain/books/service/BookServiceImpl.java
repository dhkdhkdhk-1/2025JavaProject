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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository; // ★ 추가

    @Override
    public BookResponse register(BookRegisterRequest request) {
        // 1) branchId로 지점 조회 (없으면 404)
        BranchEntity branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> BranchNotFoundException.EXCEPTION);

        // 2) DTO -> Entity (branch 제외)
        BookEntity entity = BookMapper.toEntity(request);

        // 3) branch 세팅 (nullable=false 이므로 반드시 필요)
        entity.uptBranch(branch);

        // 4) 저장 & 응답
        return BookMapper.toResponse(bookRepository.save(entity));
    }

    @Override
    public BookResponse modify(BookModRequest request) {
        BookEntity book = bookRepository.findById(request.getId())
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        // 기본 필드 업데이트
        book.uptTitle(request.getTitle());
        book.uptCategory(request.getCategory());
        book.uptAuthor(request.getAuthor());
        book.uptPublisher(request.getPublisher());
        if (request.isAvailable()) book.markAsReturned(); else book.markAsBorrowed();

        // description / imageUrl도 필요하면 엔티티에 편의 메서드 추가해서 반영
        // 예: book.uptDescription(request.getDescription());
        // 예: book.uptImageUrl(request.getImageUrl());

        // ★ branch 변경 반영
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

        return bookRepository.findAll().stream().map(BookMapper::toResponse).toList();
    }

    @Override // 책 한페이지에 한줄에 5개 3줄 총 15개 띄우기 위한 코드
    public Page<BookResponse> getList(Pageable pageable) {
        Pageable fixedPageable = Pageable.ofSize(9).withPage(pageable.getPageNumber());

        // DB 조회
        Page<BookEntity> page = bookRepository.findAll(fixedPageable);

        // 엔티티 -> DTO 변환
        List<BookResponse> responses = page.getContent().stream()

        return bookRepository.findAll().stream()
                .map(BookMapper::toResponse)
                .toList();
    }

    @Override // 프론트에서 넘긴 pageable 그대로 사용 (강제 size 고정 제거)
    public Page<BookResponse> getList(Pageable pageable) {
        return bookRepository.findAll(pageable).map(BookMapper::toResponse);
    }
}
