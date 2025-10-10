package kr.ac.ync.library.domain.rentals.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRentalHistoryEntity is a Querydsl query type for RentalHistoryEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRentalHistoryEntity extends EntityPathBase<RentalHistoryEntity> {

    private static final long serialVersionUID = -1626011271L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRentalHistoryEntity rentalHistoryEntity = new QRentalHistoryEntity("rentalHistoryEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final StringPath actionType = createString("actionType");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final QRentalEntity rental;

    public QRentalHistoryEntity(String variable) {
        this(RentalHistoryEntity.class, forVariable(variable), INITS);
    }

    public QRentalHistoryEntity(Path<? extends RentalHistoryEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRentalHistoryEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRentalHistoryEntity(PathMetadata metadata, PathInits inits) {
        this(RentalHistoryEntity.class, metadata, inits);
    }

    public QRentalHistoryEntity(Class<? extends RentalHistoryEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.rental = inits.isInitialized("rental") ? new QRentalEntity(forProperty("rental"), inits.get("rental")) : null;
    }

}

