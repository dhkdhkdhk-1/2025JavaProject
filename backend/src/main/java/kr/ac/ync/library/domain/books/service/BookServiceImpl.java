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

    /** ✅ 도서 등록 */
    @Override
    public BookResponse register(BookRegisterRequest request) {
        BookEntity entity = BookMapper.toEntity(request);
        return BookMapper.toResponse(bookRepository.save(entity));
    }

    /** ✅ 도서 수정 */
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

    /** ✅ 도서 삭제 */
    @Override
    public void remove(Long id) {
        bookRepository.findById(id).orElseThrow(() -> BookNotFoundException.EXCEPTION);
        bookRepository.deleteById(id);
    }

    /** ✅ 단일 도서 조회 */
    @Override
    public BookResponse get(Long id) {
        return BookMapper.toResponse(bookRepository.findById(id)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION));
    }

    /** ✅ 전체 목록 조회 */
    @Override
    public List<BookResponse> getList() {
        return bookRepository.findAll().stream()
                .map(b -> BookMapper.toResponse((BookEntity) b)) // ✅ 명시적 캐스팅
                .collect(Collectors.toList());
    }

    /** ✅ 페이징 목록 조회 */
    @Override
    public Page<BookResponse> getList(Pageable pageable) {
        Page<BookEntity> page = bookRepository.findAll(pageable);
        List<BookResponse> responses = page.getContent().stream()
                .map(b -> BookMapper.toResponse((BookEntity) b)) // ✅ 명시적 캐스팅
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    /**
     * ✅ 장르 + 검색어 필터 포함 목록 조회 (BookRepository 수정 없이 Stream으로 구현)
     */
    @Override
    public Page<BookResponse> getList(Pageable pageable, String keyword, List<BookCategory> genres) {
        // 1️⃣ 모든 도서 가져오기
        List<BookEntity> allBooks = bookRepository.findAll();

        // 2️⃣ 검색어 & 장르 필터링
        String searchKeyword = (keyword == null || keyword.isBlank()) ? "" : keyword.toLowerCase();

        List<BookEntity> filtered = allBooks.stream()
                .filter(b -> {
                    boolean matchesKeyword =
                            searchKeyword.isEmpty() ||
                                    (b.getTitle() != null && b.getTitle().toLowerCase().contains(searchKeyword)) ||
                                    (b.getAuthor() != null && b.getAuthor().toLowerCase().contains(searchKeyword)) ||
                                    (b.getPublisher() != null && b.getPublisher().toLowerCase().contains(searchKeyword));

                    boolean matchesGenre =
                            (genres == null || genres.isEmpty()) ||
                                    genres.contains(b.getCategory());

                    return matchesKeyword && matchesGenre;
                })
                .collect(Collectors.toList());

        // 3️⃣ 정렬 (createdDateTime null-safe)
        filtered.sort(Comparator.comparing(
                (BookEntity b) -> Optional.ofNullable(b.getCreatedDateTime())
                        .orElse(LocalDateTime.MIN)
        ).reversed());

        // 4️⃣ 페이징 처리 (List → Page)
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());

        List<BookResponse> pagedContent = (start > end ? Collections.emptyList() : filtered.subList(start, end))
                .stream()
                .map(b -> BookMapper.toResponse((BookEntity) b)) // ✅ 명시적 캐스팅
                .collect(Collectors.toList());

        return new PageImpl<>(pagedContent, pageable, filtered.size());
    }

    /** ✅ 지점별 상태 조회 */
    @Override
    public List<Map<String, Object>> getBookBranchStatus(Long bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        List<BranchEntity> allBranches = branchRepository.findAll();

        // ✅ 중복 키 발생 방지: merge 함수 추가
        Map<Long, Boolean> connectedBranches = book.getBookBranches()
                .stream()
                .collect(Collectors.toMap(
                        rel -> rel.getBranch().getId(),
                        BookBranchEntity::isAvailable,
                        (v1, v2) -> v1  // 중복 branchId가 있을 경우 첫 번째 값 유지
                ));

        return allBranches.stream().map(branch -> {
            Map<String, Object> info = new HashMap<>();
            info.put("branchId", branch.getId());
            info.put("branchName", branch.getName());
            info.put("address", branch.getLocation());
            info.put("available", connectedBranches.getOrDefault(branch.getId(), false));
            return info;
        }).collect(Collectors.toList());
    }

}
