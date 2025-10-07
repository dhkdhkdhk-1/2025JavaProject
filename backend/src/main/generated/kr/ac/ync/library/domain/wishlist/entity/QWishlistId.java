package kr.ac.ync.library.domain.wishlist.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QWishlistId is a Querydsl query type for WishlistId
 */
@Generated("com.querydsl.codegen.DefaultEmbeddableSerializer")
public class QWishlistId extends BeanPath<WishlistId> {

    private static final long serialVersionUID = -1304718668L;

    public static final QWishlistId wishlistId = new QWishlistId("wishlistId");

    public final NumberPath<Long> bookId = createNumber("bookId", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QWishlistId(String variable) {
        super(WishlistId.class, forVariable(variable));
    }

    public QWishlistId(Path<? extends WishlistId> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWishlistId(PathMetadata metadata) {
        super(WishlistId.class, metadata);
    }

}

