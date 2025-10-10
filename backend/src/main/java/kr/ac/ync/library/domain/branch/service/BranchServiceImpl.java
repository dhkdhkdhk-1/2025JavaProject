package kr.ac.ync.library.domain.branch.service;

import kr.ac.ync.library.domain.branch.dto.*;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.exception.BranchNotFoundException;
import kr.ac.ync.library.domain.branch.mapper.BranchMapper;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final BranchMapper branchMapper;

    @Override
    public BranchResponse register(BranchRegisterRequest request) {
        BranchEntity entity = branchMapper.toEntity(request);
        BranchEntity saved = branchRepository.save(entity);
        return branchMapper.toResponse(saved);
    }

    @Override
    public BranchResponse modify(BranchModRequest request) {
        BranchEntity origin = branchRepository.findById(request.getId())
                .orElseThrow(() -> BranchNotFoundException.EXCEPTION);

        BranchEntity updated = branchMapper.toUpdatedEntity(origin, request);
        BranchEntity saved = branchRepository.save(updated);
        return branchMapper.toResponse(saved);
    }

    @Override
    public void remove(Long id) {
        if (!branchRepository.existsById(id)) {
            throw BranchNotFoundException.EXCEPTION;
        }
        branchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse get(Long id) {
        BranchEntity entity = branchRepository.findById(id)
                .orElseThrow(() -> BranchNotFoundException.EXCEPTION);
        return branchMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BranchResponse> getList(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<BranchEntity> branchPage = branchRepository.findAll(pageable);

        return branchPage.map(branchMapper::toResponse);
    }
}
