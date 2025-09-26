package kr.ac.ync.library.domain.board.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QInquiryEntity is a Querydsl query type for InquiryEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QInquiryEntity extends EntityPathBase<InquiryEntity> {

    private static final long serialVersionUID = 1177390457L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QInquiryEntity inquiryEntity = new QInquiryEntity("inquiryEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final StringPath answer = createString("answer");

    public final StringPath category = createString("category");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final NumberPath<Integer> i = createNumber("i", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final StringPath question = createString("question");

    public final StringPath status = createString("status");

    public final kr.ac.ync.library.domain.users.entity.QUserEntity user;

    public QInquiryEntity(String variable) {
        this(InquiryEntity.class, forVariable(variable), INITS);
    }

    public QInquiryEntity(Path<? extends InquiryEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QInquiryEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QInquiryEntity(PathMetadata metadata, PathInits inits) {
        this(InquiryEntity.class, metadata, inits);
    }

    public QInquiryEntity(Class<? extends InquiryEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new kr.ac.ync.library.domain.users.entity.QUserEntity(forProperty("user")) : null;
    }

}

