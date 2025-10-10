package kr.ac.ync.library.domain.branch.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.branch.dto.BranchModRequest;
import kr.ac.ync.library.domain.branch.dto.BranchRegisterRequest;
import kr.ac.ync.library.domain.branch.dto.BranchResponse;
import kr.ac.ync.library.domain.branch.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/branch")
public class BranchController {

    private final BranchService branchService;

    // 지점 등록 (Create)
    @PostMapping
    public ResponseEntity<BranchResponse> register(@Valid @RequestBody BranchRegisterRequest request) {
        return ResponseEntity.ok(branchService.register(request));
    }

    // 지점 수정 (Update)
    @PutMapping
    public ResponseEntity<BranchResponse> modify(@Valid @RequestBody BranchModRequest request) {
        return ResponseEntity.ok(branchService.modify(request));
    }

    // 지점 삭제 (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        branchService.remove(id);
        return ResponseEntity.noContent().build();
    }

    // 지점 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<BranchResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(branchService.get(id));
    }

    // ✅ 지점 전체 조회 (Read All)
    @GetMapping("/list")
    public ResponseEntity<List<BranchResponse>> list() {
        return ResponseEntity.ok(branchService.getList());
    }
}
