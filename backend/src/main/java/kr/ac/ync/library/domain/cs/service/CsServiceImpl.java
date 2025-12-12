package kr.ac.ync.library.domain.cs.service;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.cs.dto.*;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.entity.csstatus.CsStatus;
import kr.ac.ync.library.domain.cs.exception.CsAccessDenyException;
import kr.ac.ync.library.domain.cs.exception.CsNotFoundException;
import kr.ac.ync.library.domain.cs.mapper.CsMapper;
import kr.ac.ync.library.domain.cs.repository.CsRepository;
import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
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
    public void register(CsUserRegisterRequest request) {
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

        // 어드민은 모든 문의 조회 가능
        if (user.getRole() == UserRole.ADMIN) {
            return CsMapper.toCsDetailResponse(cs);
        }
        // 매니저는 자기 지점 문의만 조회 가능
        else if (user.getRole() == UserRole.MANAGER) {
            if (!cs.getBranch().getId().equals(user.getBranchId())) {
                throw CsAccessDenyException.EXCEPTION;
            }
            return CsMapper.toCsDetailResponse(cs);
        }
        // 유저는 자기 문의만 조회 가능
        else {
            if (!cs.getUser().getId().equals(user.getId())) {
                throw CsAccessDenyException.EXCEPTION;
            }
            return CsMapper.toCsDetailResponse(cs);
        }
    }

    @Override // 유저 문의내역 전체 출력
    public Page<CsUserListResponse> getMyList(Long userId, Pageable pageable) {

        Page<CsEntity> page = csRepository.findByUserId(userId, pageable);

        List<CsUserListResponse> getUserList = page
                .getContent()
                .stream()
                .map(CsMapper::toCsUserListResponse)
                .toList();

        return new PageImpl<>(getUserList, pageable, page.getTotalElements());
    }

    @Override
    public void answer(Long csId, CsAdminAnswerRequest request) {
        User user = userSecurity.getUser();
        // 유저는 답변 불가능
        if (!user.getRole().equals(UserRole.MANAGER) && !user.getRole().equals(UserRole.ADMIN)) {
            throw CsAccessDenyException.EXCEPTION;
        }
        // 문의글 존재 여부 판단
        CsEntity cs = csRepository.findById(csId)
                .orElseThrow(() -> CsNotFoundException.EXCEPTION);

        // 어드민은 모든 문의에 답변 가능
        if (user.getRole() == UserRole.ADMIN) {
            cs.setAnswerContent(request.getAnswerContent());
            cs.setStatus(CsStatus.COMPLETED);
            cs.setAnswerCreatedAt(LocalDateTime.now());
            csRepository.save(cs);
        }
        // 매니저는 자기 지점 문의에만 답변 가능
        else if (user.getRole() == UserRole.MANAGER) {
            if (!cs.getBranch().getId().equals(user.getBranchId())) {
                throw CsAccessDenyException.EXCEPTION;
            }
            cs.setAnswerContent(request.getAnswerContent());
            cs.setStatus(CsStatus.COMPLETED);
            cs.setAnswerCreatedAt(LocalDateTime.now());
            csRepository.save(cs);
        }
    }

    @Override
    public Page<CsAdminListResponse> getAll(Pageable pageable) {

        User user = userSecurity.getUser();
        Page<CsEntity> page;

        if (user.getRole() == UserRole.ADMIN) {
            page = csRepository.findAll(pageable);
        }
        else if (user.getRole() == UserRole.MANAGER) {
            Long branchId = user.getBranchId();
            page = csRepository.findByBranchId(branchId, pageable);
        }
        else {
            throw CsAccessDenyException.EXCEPTION;
        }

        List<CsAdminListResponse> list = page.getContent()
                .stream()
                .map(CsMapper::toCsAdminListResponse)
                .toList();

        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

}