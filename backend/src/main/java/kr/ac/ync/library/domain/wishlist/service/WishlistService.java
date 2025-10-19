package kr.ac.ync.library.domain.wishlist.service;

import kr.ac.ync.library.domain.wishlist.dto.WishlistResponse;

import java.util.List;

public interface WishlistService {

    WishlistResponse addWishlist(Long userId, Long bookId);
    void removeWishlist(Long userId, Long bookId);
    List<WishlistResponse> getMyWishlist(Long userId);
    boolean isWishlisted(Long userId, Long bookId);
}