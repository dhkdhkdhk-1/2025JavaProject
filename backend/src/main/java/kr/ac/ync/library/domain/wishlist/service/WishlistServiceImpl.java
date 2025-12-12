package kr.ac.ync.library.domain.wishlist.service;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.books.exception.BookNotFoundException;
import kr.ac.ync.library.domain.books.repository.BookRepository;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import kr.ac.ync.library.domain.wishlist.dto.WishlistResponse;
import kr.ac.ync.library.domain.wishlist.entity.WishlistEntity;
import kr.ac.ync.library.domain.wishlist.entity.WishlistId;
import kr.ac.ync.library.domain.wishlist.mapper.WishlistMapper;
import kr.ac.ync.library.domain.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public WishlistResponse addWishlist(Long userId, Long bookId) {
        if (wishlistRepository.existsByUser_IdAndBook_Id(userId, bookId)) {
            throw new IllegalStateException("이미 찜한 도서입니다.");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> BookNotFoundException.EXCEPTION);

        WishlistEntity entity = WishlistEntity.builder()
                .id(new WishlistId(userId, bookId))
                .user(user)
                .book(book)
                .build();

        return WishlistMapper.toResponse(wishlistRepository.save(entity));
    }

    @Override
    public void removeWishlist(Long userId, Long bookId) {
        wishlistRepository.deleteByUser_IdAndBook_Id(userId, bookId);
    }

    /** ✅ 기존에는 List.of() 로 잘못 반환 → 수정됨 */
    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getMyWishlist(Long userId) {
        return wishlistRepository.findByUser_Id(userId)
                .stream()
                .map(WishlistMapper::toResponse)
                .toList();
    }

    /** ✅ 페이징 버전 추가 */
    @Override
    @Transactional(readOnly = true)
    public Page<WishlistResponse> getMyWishlist(Long userId, Pageable pageable) {
        return wishlistRepository.findByUser_Id(userId, pageable)
                .map(WishlistMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isWishlisted(Long userId, Long bookId) {
        return wishlistRepository.existsByUser_IdAndBook_Id(userId, bookId);
    }
}
