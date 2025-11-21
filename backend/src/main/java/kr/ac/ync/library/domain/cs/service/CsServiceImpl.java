package kr.ac.ync.library.domain.cs.service;

import kr.ac.ync.library.domain.board.dto.BoardResponse;
import kr.ac.ync.library.domain.board.entity.BoardEntity;
import kr.ac.ync.library.domain.branch.dto.Branch;
import kr.ac.ync.library.domain.branch.dto.BranchResponse;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.cs.dto.CsAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsRequest;
import kr.ac.ync.library.domain.cs.dto.CsResponse;
import kr.ac.ync.library.domain.cs.entity.CsEntity;
import kr.ac.ync.library.domain.cs.exception.CsNotFoundException;
import kr.ac.ync.library.domain.cs.mapper.CsMapper;
import kr.ac.ync.library.domain.cs.repository.CsRepository;
import kr.ac.ync.library.domain.reviews.dto.ReviewResponse;
import kr.ac.ync.library.domain.reviews.entity.ReviewEntity;
import kr.ac.ync.library.domain.reviews.mapper.ReviewMapper;
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

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CsServiceImpl implements CsService{

    private final CsRepository csRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final UserSecurity userSecurity;
    private final CsMapper csMapper;

    @Override
    public void register(CsRequest request, Long userId, Long branchId) {
        User user = userSecurity.getUser();
        UserEntity userEntity = userRepository.getReferenceById(user.getId());
        BranchEntity branchEntity = branchRepository.getReferenceById(branchId);
        csRepository.save(csMapper.toEntity(request, userEntity, branchEntity));
    }

    @Override
    public void answer(Long csId, CsAnswerRequest request) {

    }

    @Override
    public CsResponse get(Long id) {
        return null;
    }

    @Override
    public Page<CsResponse> getList(Pageable pageable) {
            Pageable fixedPageable = Pageable.ofSize(10).withPage(pageable.getPageNumber());

            Page<CsEntity> page = csRepository.findAll(fixedPageable);
            List<CsResponse> responses = page.getContent()
                    .stream()
                    .map(csMapper::toDto)
                    .toList();
            return new PageImpl<>(responses, fixedPageable, page.getTotalElements());
        }

}