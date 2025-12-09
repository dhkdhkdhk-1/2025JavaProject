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

    // 로그인한 유저 문의글 상세보기
    CsDetailResponse get(Long id);

    // 로그인한 유저 문의글 전체 목록
    Page<CsListResponse> getMyList(Long userId, Pageable pageable);

    void answer(Long csId, CsAnswerRequest request);

    // 모든 유저의 문의글 조회용(관리자)
    Page<CsListResponse> getAll(Pageable pageable);
}
