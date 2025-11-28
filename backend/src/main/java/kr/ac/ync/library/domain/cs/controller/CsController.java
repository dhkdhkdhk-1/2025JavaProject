package kr.ac.ync.library.domain.cs.controller;

import jakarta.validation.Valid;
import kr.ac.ync.library.domain.cs.dto.CsRegisterRequest;
import kr.ac.ync.library.domain.cs.service.CsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cs")
public class CsController {

    private final CsService csService;

    @PostMapping("/write")
    public ResponseEntity<CsRegisterRequest> write(
            @Valid @RequestBody CsRegisterRequest csRegisterRequest )
    {
//         csService.register(csRegisterRequest, branchId);
        return  null;
    }
}
