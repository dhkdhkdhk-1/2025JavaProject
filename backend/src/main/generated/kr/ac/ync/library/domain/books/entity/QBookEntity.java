package kr.ac.ync.library.domain.books.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBookEntity is a Querydsl query type for BookEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBookEntity extends EntityPathBase<BookEntity> {

    private static final long serialVersionUID = -438068127L;

    public static final QBookEntity bookEntity = new QBookEntity("bookEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final StringPath author = createString("author");

    public final BooleanPath available = createBoolean("available");

    public final ListPath<BookBranchEntity, QBookBranchEntity> bookBranches = this.<BookBranchEntity, QBookBranchEntity>createList("bookBranches", BookBranchEntity.class, QBookBranchEntity.class, PathInits.DIRECT2);

    public final EnumPath<kr.ac.ync.library.domain.books.entity.enums.BookCategory> category = createEnum("category", kr.ac.ync.library.domain.books.entity.enums.BookCategory.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final StringPath description = createString("description");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final StringPath publisher = createString("publisher");

    public final ListPath<kr.ac.ync.library.domain.reviews.entity.ReviewEntity, kr.ac.ync.library.domain.reviews.entity.QReviewEntity> reviews = this.<kr.ac.ync.library.domain.reviews.entity.ReviewEntity, kr.ac.ync.library.domain.reviews.entity.QReviewEntity>createList("reviews", kr.ac.ync.library.domain.reviews.entity.ReviewEntity.class, kr.ac.ync.library.domain.reviews.entity.QReviewEntity.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public QBookEntity(String variable) {
        super(BookEntity.class, forVariable(variable));
    }

    public QBookEntity(Path<? extends BookEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBookEntity(PathMetadata metadata) {
        super(BookEntity.class, metadata);
    }

}

