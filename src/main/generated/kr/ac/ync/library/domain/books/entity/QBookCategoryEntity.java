package kr.ac.ync.library.domain.books.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBookCategoryEntity is a Querydsl query type for BookCategoryEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBookCategoryEntity extends EntityPathBase<BookCategoryEntity> {

    private static final long serialVersionUID = -1925992193L;

    public static final QBookCategoryEntity bookCategoryEntity = new QBookCategoryEntity("bookCategoryEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public QBookCategoryEntity(String variable) {
        super(BookCategoryEntity.class, forVariable(variable));
    }

    public QBookCategoryEntity(Path<? extends BookCategoryEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBookCategoryEntity(PathMetadata metadata) {
        super(BookCategoryEntity.class, metadata);
    }

}

