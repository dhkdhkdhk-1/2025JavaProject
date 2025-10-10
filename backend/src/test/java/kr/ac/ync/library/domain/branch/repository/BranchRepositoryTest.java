package kr.ac.ync.library.domain.branch.repository;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest

class BranchRepositoryTest {
    @Autowired
    private BranchRepository branchRepository;
    @Test
    void testInsertBranches()
    {
        IntStream.rangeClosed(1, 100)
                .forEach(i -> {
                    BranchEntity build = BranchEntity.builder().name("테스트" + i).location("위치" + i).build();
                    branchRepository.save(build);
                });
    }
}