package kr.ac.ync.library.domain.wishlist.mapper;

import kr.ac.ync.library.domain.wishlist.dto.WishlistResponse;
import kr.ac.ync.library.domain.wishlist.entity.WishlistEntity;

public class WishlistMapper {

    private WishlistMapper() {}

    public static WishlistResponse toResponse(WishlistEntity entity) {
        return WishlistResponse.builder()
                .userId(entity.getUser().getId())
                .bookId(entity.getBook().getId())
                .bookTitle(entity.getBook().getTitle())
                .author(entity.getBook().getAuthor())
                .imageUrl(entity.getBook().getImageUrl())
                .createdDateTime(entity.getCreatedDateTime())
                .build();
    }
}
