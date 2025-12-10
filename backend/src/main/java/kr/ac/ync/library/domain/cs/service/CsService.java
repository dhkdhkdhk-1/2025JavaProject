package kr.ac.ync.library.domain.cs.service;

import kr.ac.ync.library.domain.cs.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CsService  {

    void register(CsUserRegisterRequest request);

    // 로그인한 유저 문의글 상세보기
    CsDetailResponse get(Long id);

    // 로그인한 유저 문의글 전체 목록
    Page<CsUserListResponse> getMyList(Long userId, Pageable pageable);

    void answer(Long csId, CsAdminAnswerRequest request);

    // 모든 유저의 문의글 조회용(관리자)
    Page<CsAdminListResponse> getAll(Pageable pageable);
}
