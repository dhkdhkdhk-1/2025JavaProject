package kr.ac.ync.library.domain.books.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBookBranchEntity is a Querydsl query type for BookBranchEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBookBranchEntity extends EntityPathBase<BookBranchEntity> {

    private static final long serialVersionUID = 438343203L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBookBranchEntity bookBranchEntity = new QBookBranchEntity("bookBranchEntity");

    public final BooleanPath available = createBoolean("available");

    public final QBookEntity book;

    public final kr.ac.ync.library.domain.branch.entity.QBranchEntity branch;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public QBookBranchEntity(String variable) {
        this(BookBranchEntity.class, forVariable(variable), INITS);
    }

    public QBookBranchEntity(Path<? extends BookBranchEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBookBranchEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBookBranchEntity(PathMetadata metadata, PathInits inits) {
        this(BookBranchEntity.class, metadata, inits);
    }

    public QBookBranchEntity(Class<? extends BookBranchEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new QBookEntity(forProperty("book")) : null;
        this.branch = inits.isInitialized("branch") ? new kr.ac.ync.library.domain.branch.entity.QBranchEntity(forProperty("branch")) : null;
    }

}

