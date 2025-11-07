package kr.ac.ync.library.domain.cs.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCsEntity is a Querydsl query type for CsEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCsEntity extends EntityPathBase<CsEntity> {

    private static final long serialVersionUID = -762188654L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCsEntity csEntity = new QCsEntity("csEntity");

    public final kr.ac.ync.library.global.common.entity.QBaseTimeEntity _super = new kr.ac.ync.library.global.common.entity.QBaseTimeEntity(this);

    public final StringPath answerContent = createString("answerContent");

    public final kr.ac.ync.library.domain.branch.entity.QBranchEntity branch;

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime = _super.createdDateTime;

    public final EnumPath<kr.ac.ync.library.domain.cs.entity.category.CsCategory> csCategory = createEnum("csCategory", kr.ac.ync.library.domain.cs.entity.category.CsCategory.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDateTime = _super.modifiedDateTime;

    public final EnumPath<kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus> status = createEnum("status", kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus.class);

    public final StringPath title = createString("title");

    public final kr.ac.ync.library.domain.users.entity.QUserEntity user;

    public QCsEntity(String variable) {
        this(CsEntity.class, forVariable(variable), INITS);
    }

    public QCsEntity(Path<? extends CsEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCsEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCsEntity(PathMetadata metadata, PathInits inits) {
        this(CsEntity.class, metadata, inits);
    }

    public QCsEntity(Class<? extends CsEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.branch = inits.isInitialized("branch") ? new kr.ac.ync.library.domain.branch.entity.QBranchEntity(forProperty("branch")) : null;
        this.user = inits.isInitialized("user") ? new kr.ac.ync.library.domain.users.entity.QUserEntity(forProperty("user")) : null;
    }

}

