package kr.ac.ync.library.domain.cs.service;


import jakarta.validation.Valid;
import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsRequest;
import kr.ac.ync.library.domain.cs.dto.CsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CsService  {

    void register(CsRequest request, Long userId, Long branchId);

    void answer(Long csId, CsAnswerRequest request);

    CsResponse get(Long id);

    Page<CsResponse> getList(Pageable pageable);

}
