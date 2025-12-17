package kr.ac.ync.library.domain.books.service;

import jakarta.transaction.Transactional;
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
import kr.ac.ync.library.global.common.s3.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;
    private final S3Uploader s3Uploader;

    /** ✅ 도서 등록 (여러 지점) */
    @Override
    public BookResponse register(BookRegisterRequest request, MultipartFile image) throws IOException {

        // 1️⃣ Book 엔티티 생성
        BookEntity bookEntity = BookMapper.toEntity(request);

        // 2️⃣ 이미지 처리 (유지)
    if (image != null && !image.isEmpty()) {
        String imageUrl = s3Uploader.uploadBookImage(image);
        bookEntity.uptImageUrl(imageUrl);
    }

        // 3️⃣ 지점 연결 (🔥 핵심)
        List<BranchEntity> branches = branchRepository.findAllById(request.getBranchIds());

        for (BranchEntity branch : branches) {
            BookBranchEntity relation = BookBranchEntity.builder()
                    .book(bookEntity)
                    .branch(branch)
                    .available(true) // ⭐ 초기 대여 가능
                    .build();

            // 양방향 연결
            bookEntity.addBranchRelation(relation);
            branch.addBookRelation(relation);
        }

        // 4️⃣ 저장 (cascade로 BookBranchEntity 같이 저장됨)
        BookEntity saved = bookRepository.save(bookEntity);

        return BookMapper.toResponse(saved);
    }

    @Override
    public BookResponse modify(Long id, BookModRequest request, MultipartFile image) throws IOException {
        BookEntity bookEntity = bookRepository.findById(id)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        String oldImageUrl = bookEntity.getImageUrl();

        BookMapper.updateEntity(request, bookEntity);

        if (image != null && !image.isEmpty()) {
            String newImageUrl = s3Uploader.uploadBookImage(image);
            bookEntity.uptImageUrl(newImageUrl);

            if (oldImageUrl != null && !oldImageUrl.isBlank() && !oldImageUrl.equals(newImageUrl)) {
                try {
                    s3Uploader.deleteByUrl(oldImageUrl);
                } catch (Exception e) {
                    // 삭제 실패해도 수정 자체는 성공해야 하니까 로그만 남기고 넘어감
                    // log.warn("S3 old image delete failed: {}", oldImageUrl, e);
                }
            }
        }

// ===== 지점 관계 수정 (값이 있을 때만) =====
        if (request.getBranchIds() != null && !request.getBranchIds().isEmpty()) {

            List<BookBranchEntity> existingRelations = bookEntity.getBookBranches();
            Set<Long> requestBranchIds = new HashSet<>(request.getBranchIds());

            // 1️⃣ 요청에서 빠진 지점 → 관계 제거
            existingRelations.removeIf(rel ->
                    !requestBranchIds.contains(rel.getBranch().getId())
            );

            // 2️⃣ 새로 추가된 지점만 relation 생성
            Set<Long> existingBranchIds = existingRelations.stream()
                    .map(r -> r.getBranch().getId())
                    .collect(Collectors.toSet());

            List<BranchEntity> branches = branchRepository.findAllById(requestBranchIds);

            for (BranchEntity branch : branches) {
                if (!existingBranchIds.contains(branch.getId())) {
                    BookBranchEntity.link(bookEntity, branch, true);
                }
            }
        }
            try {
                return BookMapper.toResponse(bookRepository.save(bookEntity));
            } catch (DataIntegrityViolationException e){
                throw new IllegalStateException("이미 등록된 지점입니다.");
            }
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

    @Override
    @Transactional
    public void updateBookBranchAvailability(Long bookId, Long branchId, boolean available) {

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        BookBranchEntity relation = book.getBookBranches().stream()
                .filter(r -> r.getBranch().getId().equals(branchId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 책-지점 관계가 존재하지 않습니다.")
                );

        // ⭐ 여기서만 상태 변경
        relation.setAvailable(available);
    }
}
