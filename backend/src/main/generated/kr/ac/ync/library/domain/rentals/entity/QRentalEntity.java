package kr.ac.ync.library.domain.rentals.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRentalEntity is a Querydsl query type for RentalEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRentalEntity extends EntityPathBase<RentalEntity> {

    private static final long serialVersionUID = -424506815L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRentalEntity rentalEntity = new QRentalEntity("rentalEntity");

    public final kr.ac.ync.library.domain.books.entity.QBookEntity book;

    public final kr.ac.ync.library.domain.branch.entity.QBranchEntity branch;

    public final DateTimePath<java.time.LocalDateTime> dueDate = createDateTime("dueDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> rentalDate = createDateTime("rentalDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> returnDate = createDateTime("returnDate", java.time.LocalDateTime.class);

    public final BooleanPath returned = createBoolean("returned");

    public final StringPath status = createString("status");

    public final kr.ac.ync.library.domain.users.entity.QUserEntity user;

    public QRentalEntity(String variable) {
        this(RentalEntity.class, forVariable(variable), INITS);
    }

    public QRentalEntity(Path<? extends RentalEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRentalEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRentalEntity(PathMetadata metadata, PathInits inits) {
        this(RentalEntity.class, metadata, inits);
    }

    public QRentalEntity(Class<? extends RentalEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new kr.ac.ync.library.domain.books.entity.QBookEntity(forProperty("book"), inits.get("book")) : null;
        this.branch = inits.isInitialized("branch") ? new kr.ac.ync.library.domain.branch.entity.QBranchEntity(forProperty("branch")) : null;
        this.user = inits.isInitialized("user") ? new kr.ac.ync.library.domain.users.entity.QUserEntity(forProperty("user")) : null;
    }

}

