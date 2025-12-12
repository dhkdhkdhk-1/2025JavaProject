package kr.ac.ync.library.domain.board.mapper;

import kr.ac.ync.library.domain.board.dto.BoardRequest;
import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import lombok.experimental.UtilityClass;

@UtilityClass
public class BoardMapper {

    /** ✅ Entity → DTO 변환 */
    public static BoardResponse toResponse(BoardEntity entity) {
        return BoardResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .type(entity.getType())
                .username(entity.getUser() != null ? entity.getUser().getUsername() : "알 수 없음")
                .viewCount(entity.getViewCount() == null ? 0L : entity.getViewCount())
                .createdAt(entity.getCreatedDateTime())
                .modifiedAt(entity.getModifiedDateTime())
                .deleted(entity.isDeleted())
                .build();
    }

    /** ✅ DTO → Entity 변환 */
    public static BoardEntity toEntity(BoardRequest request, UserEntity user) {
        return BoardEntity.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .type(request.getType() != null ? request.getType() : "일반")
                .user(user)
                .viewCount(0L)
                .deleted(false)
                .build();
    }

    /** ✅ Entity Update */
    public static void updateEntity(BoardEntity entity, BoardRequest request) {
        entity.setTitle(request.getTitle().trim());
        entity.setContent(request.getContent().trim());
        entity.setType(request.getType() != null ? request.getType() : "일반");
    }
}
