package kr.ac.ync.library.domain.cs.mapper;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsListResponse;
import kr.ac.ync.library.domain.cs.dto.CsRegisterRequest;
import kr.ac.ync.library.domain.cs.dto.CsDetailResponse;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import kr.ac.ync.library.domain.users.entity.UserEntity;

public class CsMapper {

    public static CsEntity toCsEntityRegisterRequest(CsRegisterRequest request, UserEntity userEntity, BranchEntity branchEntity) {
        return CsEntity.builder()
                .title(request.getTitle())
                .branch(branchEntity)
                .user(userEntity)
                .content(request.getContent())
                .csCategory(request.getCategory())
                .status(CsStatus.WAITING)
                .build();
    }

    public static CsDetailResponse toCsDetailResponse(CsEntity csEntity) {
        return CsDetailResponse.builder()
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
                .answerCreatedAt(csEntity.getAnswerCreatedAt())
                .build();
    }

    public static CsListResponse toCsListResponse(CsEntity csEntity) {

        return CsListResponse.builder()
                .id(csEntity.getId())
                .title(csEntity.getTitle())
                .csCategory(csEntity.getCsCategory())
                .csStatus(csEntity.getStatus())
                .build();
    }

}
