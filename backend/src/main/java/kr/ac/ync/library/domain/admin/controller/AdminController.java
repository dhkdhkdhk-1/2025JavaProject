package kr.ac.ync.library.domain.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController
{

    @GetMapping
    public ResponseEntity get()
    {
        return ResponseEntity.ok().build();
    }

}
