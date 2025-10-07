package kr.ac.ync.library.domain.wishlist.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWishlistEntity is a Querydsl query type for WishlistEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWishlistEntity extends EntityPathBase<WishlistEntity> {

    private static final long serialVersionUID = 704312572L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWishlistEntity wishlistEntity = new QWishlistEntity("wishlistEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final kr.ac.ync.library.domain.books.entity.QBookEntity book;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final QWishlistId id;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final kr.ac.ync.library.domain.users.entity.QUserEntity user;

    public QWishlistEntity(String variable) {
        this(WishlistEntity.class, forVariable(variable), INITS);
    }

    public QWishlistEntity(Path<? extends WishlistEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWishlistEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWishlistEntity(PathMetadata metadata, PathInits inits) {
        this(WishlistEntity.class, metadata, inits);
    }

    public QWishlistEntity(Class<? extends WishlistEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new kr.ac.ync.library.domain.books.entity.QBookEntity(forProperty("book"), inits.get("book")) : null;
        this.id = inits.isInitialized("id") ? new QWishlistId(forProperty("id")) : null;
        this.user = inits.isInitialized("user") ? new kr.ac.ync.library.domain.users.entity.QUserEntity(forProperty("user")) : null;
    }

}

