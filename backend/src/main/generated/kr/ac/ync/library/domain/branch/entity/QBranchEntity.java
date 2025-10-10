package kr.ac.ync.library.domain.branch.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBranchEntity is a Querydsl query type for BranchEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBranchEntity extends EntityPathBase<BranchEntity> {

    private static final long serialVersionUID = -447904778L;

    public static final QBranchEntity branchEntity = new QBranchEntity("branchEntity");

    public final ListPath<kr.ac.ync.library.domain.books.entity.BookEntity, kr.ac.ync.library.domain.books.entity.QBookEntity> books = this.<kr.ac.ync.library.domain.books.entity.BookEntity, kr.ac.ync.library.domain.books.entity.QBookEntity>createList("books", kr.ac.ync.library.domain.books.entity.BookEntity.class, kr.ac.ync.library.domain.books.entity.QBookEntity.class, PathInits.DIRECT2);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath location = createString("location");

    public final StringPath name = createString("name");

    public QBranchEntity(String variable) {
        super(BranchEntity.class, forVariable(variable));
    }

    public QBranchEntity(Path<? extends BranchEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBranchEntity(PathMetadata metadata) {
        super(BranchEntity.class, metadata);
    }

}

