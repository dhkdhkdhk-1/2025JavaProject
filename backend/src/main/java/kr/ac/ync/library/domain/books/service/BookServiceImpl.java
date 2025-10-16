package kr.ac.ync.library.domain.books.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.books.entity.BookBranchEntity;
import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.mapper.BookMapper;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;

    @Override
    public BookResponse register(BookRegisterRequest request) {
        BookEntity entity = BookMapper.toEntity(request);
        return BookMapper.toResponse(bookRepository.save(entity));
    }

    @Override
    public BookResponse modify(BookModRequest request) {
        BookEntity bookEntity = bookRepository.findById(request.getId())
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        bookEntity.uptTitle(request.getTitle());
        bookEntity.uptCategory(request.getCategory());
        bookEntity.uptAuthor(request.getAuthor());
        bookEntity.uptPublisher(request.getPublisher());

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
                .toList();
    }

    @Override
    public Page<BookResponse> getList(Pageable pageable) {
        Page<BookEntity> page = bookRepository.findAll(pageable);
        List<BookResponse> responses = page.getContent().stream()
                .map(BookMapper::toResponse)
                .toList();
        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    // ✅ 수정: 중간 엔티티(BookBranchEntity) 기반 지점별 책 상태 조회
    @Override
    public List<Map<String, Object>> getBookBranchStatus(Long bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        // 모든 지점 조회
        List<BranchEntity> allBranches = branchRepository.findAll();

        // 책이 연결된 지점 ID 및 상태 추출 (BookBranchEntity 이용)
        Map<Long, Boolean> connectedBranches = book.getBookBranches()
                .stream()
                .collect(Collectors.toMap(
                        rel -> rel.getBranch().getId(),
                        BookBranchEntity::isAvailable
                ));

        // 각 지점별 상태 반환
        return allBranches.stream().map(branch -> {
            Map<String, Object> info = new HashMap<>();
            info.put("branchId", branch.getId());
            info.put("branchName", branch.getName());
            info.put("address", branch.getLocation());

            // ✅ 연결되어 있으면 해당 available 사용, 아니면 false
            boolean available = connectedBranches.getOrDefault(branch.getId(), false);
            info.put("available", available);

            return info;
        }).collect(Collectors.toList());
    }
}
