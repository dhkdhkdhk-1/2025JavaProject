package kr.ac.ync.library.domain.cs.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.cs.dto.CsAdminAnswerRequest;
import kr.ac.ync.library.domain.cs.dto.CsAdminListResponse;
import kr.ac.ync.library.domain.cs.service.CsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cs/admin")
public class CsAdminController {

    private final CsService csService;

    @GetMapping("/list")
    public ResponseEntity<Page<CsAdminListResponse>> getAllCsList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CsAdminListResponse> allList = csService.getAll(pageable);
        return ResponseEntity.ok(allList);
    }

    @PostMapping("/{csId}/answer")
    public ResponseEntity<Void> answerRegister(
            @Valid @RequestBody CsAdminAnswerRequest request,
            @PathVariable Long csId
    ) {
        csService.answer(csId, request);
        return ResponseEntity.ok().build();
    }
}
