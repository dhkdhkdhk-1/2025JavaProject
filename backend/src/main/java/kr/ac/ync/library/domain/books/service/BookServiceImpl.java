package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.entity.enums.BookCategory;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;

    /** ✅ 도서 등록 (여러 지점) */
    @Override
    public BookResponse register(BookRegisterRequest request) {

        if (request.getBranchIds() == null || request.getBranchIds().isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 지점을 선택해야 합니다.");
        }

        BookEntity book = BookMapper.toEntity(request);

        for (Long branchId : request.getBranchIds()) {
            BranchEntity branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지점입니다."));

            BookBranchEntity.link(book, branch, true);
        }

        return BookMapper.toResponse(bookRepository.save(book));
    }

    // ===== 이하 기존 코드 유지 =====

    @Override
    public BookResponse modify(BookModRequest request) {
        BookEntity bookEntity = bookRepository.findById(request.getId())
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        bookEntity.uptTitle(request.getTitle());
        bookEntity.uptCategory(request.getCategory());
        bookEntity.uptAuthor(request.getAuthor());
        bookEntity.uptPublisher(request.getPublisher());
        bookEntity.uptDescription(request.getDescription());
        bookEntity.uptImageUrl(request.getImageUrl());

        if (request.isAvailable()) bookEntity.markAsReturned();
        else bookEntity.markAsBorrowed();

        return BookMapper.toResponse(bookRepository.save(bookEntity));
    }

    @Override
    public void remove(Long id) {
        bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION);
        bookRepository.deleteById(id);
    }

    @Override
    public BookResponse get(Long id) {
        return BookMapper.toResponse(bookRepository.findById(id)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION));
    }

    @Override
    public List<BookResponse> getList() {
        return bookRepository.findAll().stream()
                .map(BookMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BookResponse> getList(Pageable pageable) {
        Page<BookEntity> page = bookRepository.findAll(pageable);
        return page.map(BookMapper::toResponse);
    }

    @Override
    public Page<BookResponse> getList(Pageable pageable, String keyword, List<BookCategory> genres) {
        List<BookEntity> allBooks = bookRepository.findAll();

        String search = keyword == null ? "" : keyword.toLowerCase();

        List<BookEntity> filtered = allBooks.stream()
                .filter(b ->
                        (search.isEmpty()
                                || b.getTitle().toLowerCase().contains(search)
                                || b.getAuthor().toLowerCase().contains(search))
                                &&
                                (genres == null || genres.isEmpty() || genres.contains(b.getCategory()))
                )
                .sorted(Comparator.comparing(
                        (BookEntity b) -> Optional.ofNullable(b.getCreatedDateTime())
                                .orElse(LocalDateTime.MIN)
                ).reversed())
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());

        return new PageImpl<>(
                filtered.subList(start, end).stream().map(BookMapper::toResponse).toList(),
                pageable,
                filtered.size()
        );
    }

    @Override
    public List<Map<String, Object>> getBookBranchStatus(Long bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        List<BranchEntity> branches = branchRepository.findAll();

        Map<Long, Boolean> map = book.getBookBranches().stream()
                .collect(Collectors.toMap(
                        r -> r.getBranch().getId(),
                        BookBranchEntity::isAvailable
                ));

        return branches.stream().map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("branchId", b.getId());
            m.put("branchName", b.getName());
            m.put("available", map.getOrDefault(b.getId(), false));
            return m;
        }).toList();
    }
}
