package kr.ac.ync.library.domain.cs.service;

import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsListResponse;
import kr.ac.ync.library.domain.cs.dto.CsRegisterRequest;
import kr.ac.ync.library.domain.cs.dto.CsDetailResponse;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CsService  {

    void register(CsRegisterRequest request);

    CsDetailResponse get(Long id);

    Page<CsListResponse> getMyList(Long userId, Pageable pageable);

    void answer(Long csId, CsAnswerRequest request);

    void updateAnswer(CsEntity csEntity, CsAnswerRequest request);
}
