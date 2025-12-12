package kr.ac.ync.library.domain.wishlist.controller;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.wishlist.dto.WishlistResponse;
import kr.ac.ync.library.domain.wishlist.service.WishlistService;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserSecurity userSecurity;

    /** ✅ 찜 추가 */
    @PostMapping("/{bookId}")
    public ResponseEntity<WishlistResponse> add(@PathVariable Long bookId) {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(wishlistService.addWishlist(user.getId(), bookId));
    }

    /** ✅ 찜 삭제 */
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> remove(@PathVariable Long bookId) {
        User user = userSecurity.getUser();
        wishlistService.removeWishlist(user.getId(), bookId);
        return ResponseEntity.noContent().build();
    }

    /** ✅ 내 찜 목록 페이징 */
    @GetMapping("/me")
    public ResponseEntity<Page<WishlistResponse>> getMyWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size   // 프론트 갤러리용 12개 추천
    ) {
        User user = userSecurity.getUser();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(wishlistService.getMyWishlist(user.getId(), pageable));
    }

    /** ✅ 특정 도서 찜 여부 확인 */
    @GetMapping("/{bookId}/exists")
    public ResponseEntity<Boolean> exists(@PathVariable Long bookId) {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(wishlistService.isWishlisted(user.getId(), bookId));
    }
}
