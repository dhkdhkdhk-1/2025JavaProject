package kr.ac.ync.library.domain.cs.service;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsListResponse;
import kr.ac.ync.library.domain.cs.dto.CsRegisterRequest;
import kr.ac.ync.library.domain.cs.dto.CsDetailResponse;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import kr.ac.ync.library.domain.cs.exception.CsNotFoundException;
import kr.ac.ync.library.domain.cs.mapper.CsMapper;
import kr.ac.ync.library.domain.cs.repository.CsRepository;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import kr.ac.ync.library.global.common.security.UserSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CsServiceImpl implements CsService{

    private final CsRepository csRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final UserSecurity userSecurity;

    @Override
    public void register(CsRegisterRequest request) {
        User user = userSecurity.getUser();
        UserEntity userEntity = userRepository.getReferenceById(user.getId());
        BranchEntity branchEntity = branchRepository.getReferenceById(request.getBranchId());
        CsEntity csEntity = CsMapper.toCsEntityRegisterRequest(request, userEntity, branchEntity);
        csRepository.save(csEntity);
    }

    @Override
    public CsDetailResponse get(Long id) {

        CsEntity cs = csRepository.findById(id)
                .orElseThrow(() -> CsNotFoundException.EXCEPTION);

        User user = userSecurity.getUser();
    }

    @Override // 유저 문의내역 전체 출력
    public Page<CsListResponse> getMyList(Long userId, Pageable pageable) {

        Page<CsEntity> page = csRepository.findByUserId(userId, pageable);

        List<CsListResponse> getUserList = page
                .getContent()
                .stream()
                .map(CsMapper::toCsListResponse)
                .toList();

        return new PageImpl<>(getUserList, pageable, page.getTotalElements());
    }

    @Override
    public void answer(Long csId, CsAnswerRequest request) {
        CsEntity cs = csRepository.findById(csId)
                .orElseThrow(() -> CsNotFoundException.EXCEPTION);
        csRepository.save(cs);
    }

    @Override
    public Page<CsListResponse> getAll(Pageable pageable) {
        return null;
    }
}