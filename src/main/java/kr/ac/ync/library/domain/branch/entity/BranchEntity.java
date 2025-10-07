package kr.ac.ync.library.domain.branch.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_branch")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class BranchEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;
}
