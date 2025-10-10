package kr.ac.ync.library.domain.branch.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class BranchResponse {
    private Long id;
    private String name;
    private String location;
}
