package kr.ac.ync.library.domain.branch.dto;

import lombok.Builder;

@Builder
public class Branch {
    private Long id;
    private String name;
    private String location;
}
