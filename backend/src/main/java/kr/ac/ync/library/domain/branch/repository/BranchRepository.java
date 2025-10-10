package kr.ac.ync.library.domain.branch.repository;

import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Long> {

}
