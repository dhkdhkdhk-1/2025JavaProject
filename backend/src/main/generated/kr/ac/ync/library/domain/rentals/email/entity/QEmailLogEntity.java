package kr.ac.ync.library.domain.rentals.email.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QEmailLogEntity is a Querydsl query type for EmailLogEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QEmailLogEntity extends EntityPathBase<EmailLogEntity> {

    private static final long serialVersionUID = 1362922899L;

    public static final QEmailLogEntity emailLogEntity = new QEmailLogEntity("emailLogEntity");

    public final StringPath content = createString("content");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath recipient = createString("recipient");

    public final DateTimePath<java.time.LocalDateTime> sentAt = createDateTime("sentAt", java.time.LocalDateTime.class);

    public final StringPath subject = createString("subject");

    public QEmailLogEntity(String variable) {
        super(EmailLogEntity.class, forVariable(variable));
    }

    public QEmailLogEntity(Path<? extends EmailLogEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QEmailLogEntity(PathMetadata metadata) {
        super(EmailLogEntity.class, metadata);
    }

}

