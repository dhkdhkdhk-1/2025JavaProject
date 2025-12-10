package kr.ac.ync.library.domain.reviews.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QReviewEntity is a Querydsl query type for ReviewEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReviewEntity extends EntityPathBase<ReviewEntity> {

    private static final long serialVersionUID = 1299004353L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QReviewEntity reviewEntity = new QReviewEntity("reviewEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final kr.ac.ync.library.domain.books.entity.QBookEntity book;

    public final StringPath comment = createString("comment");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final NumberPath<Long> rating = createNumber("rating", Long.class);

    public final StringPath title = createString("title");

    public final kr.ac.ync.library.domain.users.entity.QUserEntity user;

    public QReviewEntity(String variable) {
        this(ReviewEntity.class, forVariable(variable), INITS);
    }

    public QReviewEntity(Path<? extends ReviewEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QReviewEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QReviewEntity(PathMetadata metadata, PathInits inits) {
        this(ReviewEntity.class, metadata, inits);
    }

    public QReviewEntity(Class<? extends ReviewEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new kr.ac.ync.library.domain.books.entity.QBookEntity(forProperty("book")) : null;
        this.user = inits.isInitialized("user") ? new kr.ac.ync.library.domain.users.entity.QUserEntity(forProperty("user"), inits.get("user")) : null;
    }

}

