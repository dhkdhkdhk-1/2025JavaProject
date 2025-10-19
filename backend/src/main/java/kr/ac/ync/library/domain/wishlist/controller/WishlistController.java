package kr.ac.ync.library.domain.wishlist.controller;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.wishlist.dto.WishlistResponse;
import kr.ac.ync.library.domain.wishlist.service.WishlistService;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /** ✅ 내 찜 목록 */
    @GetMapping("/me")
    public ResponseEntity<List<WishlistResponse>> getMyWishlist() {
        User user = userSecurity.getUser();
        return ResponseEntity.ok(wishlistService.getMyWishlist(user.getId()));
    }

    /** ✅ 특정 도서 찜 여부 확인 */
    @GetMapping("/check/{bookId}")
    public ResponseEntity<Boolean> isWished(@PathVariable Long bookId) {
        User user = userSecurity.getUser();
        boolean wished = wishlistService.isWishlisted(user.getId(), bookId);
        return ResponseEntity.ok(wished);
    }
}
