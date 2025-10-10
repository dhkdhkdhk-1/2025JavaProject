package kr.ac.ync.library.domain.branch.service;

import kr.ac.ync.library.domain.books.dto.BookModRequest;
import kr.ac.ync.library.domain.books.dto.BookRegisterRequest;
import kr.ac.ync.library.domain.books.dto.BookResponse;
import kr.ac.ync.library.domain.branch.dto.BranchModRequest;
import kr.ac.ync.library.domain.branch.dto.BranchRegisterRequest;
import kr.ac.ync.library.domain.branch.dto.BranchResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BranchService {
    BranchResponse register(BranchRegisterRequest request);

    BranchResponse modify(BranchModRequest request);

    void remove(Long id);

    BranchResponse get(Long id);

    Page<BranchResponse> getList(int page, int size);
}
