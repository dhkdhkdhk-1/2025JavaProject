package kr.ac.ync.library.domain.branch.mapper;

import kr.ac.ync.library.domain.branch.dto.*;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import org.springframework.stereotype.Component;

@Component
public class BranchMapper {

    // ✅ Entity → Response
    public BranchResponse toResponse(BranchEntity entity) {
        return BranchResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .location(entity.getLocation())
                .build();
    }

    // ✅ Entity → DTO (요약용)
    public Branch toDTO(BranchEntity entity) {
        return Branch.builder()
                .id(entity.getId())
                .name(entity.getName())
                .location(entity.getLocation())
                .build();
    }

    // ✅ RegisterRequest → Entity
    public BranchEntity toEntity(BranchRegisterRequest request) {
        return BranchEntity.builder()
                .name(request.getName())
                .location(request.getLocation())
                .build();
    }

    // ✅ ModRequest + 기존 Entity → 업데이트된 Entity
    public BranchEntity toUpdatedEntity(BranchEntity entity, BranchModRequest request) {
        return BranchEntity.builder()
                .id(entity.getId())
                .name(request.getName())
                .location(request.getLocation())
                .build();
    }
}
