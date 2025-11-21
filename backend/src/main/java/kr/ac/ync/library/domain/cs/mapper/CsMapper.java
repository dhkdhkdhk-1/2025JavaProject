package kr.ac.ync.library.domain.cs.mapper;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsRequest;
import kr.ac.ync.library.domain.cs.dto.CsResponse;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import kr.ac.ync.library.domain.users.entity.UserEntity;

public class CsMapper {

    public CsEntity toEntity(CsRequest request, UserEntity userEntity, BranchEntity branchEntity) {
        return CsEntity.builder()
                .title(request.getTitle())
                .branch(branchEntity)
                .user(userEntity)
                .content(request.getContent())
                .csCategory(request.getCategory())
                .build();
    }

    public CsResponse toDto(CsEntity csEntity) {
        return CsResponse.builder()
                .id(csEntity.getId())
                .title(csEntity.getTitle())
                .branchId(csEntity.getBranch().getId())
                .branchName(csEntity.getBranch().getName())
                .userId(csEntity.getUser().getId())
                .content(csEntity.getContent())
                .answerContent(csEntity.getAnswerContent())
                .category(csEntity.getCsCategory())
                .status(csEntity.getStatus())
                .createdAt(csEntity.getCreatedDateTime())
                .build();
    }

    public void updateAnswer(CsEntity csEntity, CsAnswerRequest request) {
        csEntity.setAnswerContent(request.getAnswerContent());
        csEntity.setStatus(CsStatus.COMPLETED);
    }
}
