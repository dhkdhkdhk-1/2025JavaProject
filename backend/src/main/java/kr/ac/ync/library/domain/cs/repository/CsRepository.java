package kr.ac.ync.library.domain.cs.repository;

import kr.ac.ync.library.domain.cs.entity.CsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CsRepository extends JpaRepository <CsEntity, Long> {

    Page<CsEntity> findByUserId(Long userId, Pageable pageable);
    // 어드민은 모든 문의 매니저는 자기지점 문의 볼 수 있게 할때 사용
    Page<CsEntity> findByBranchId(Long branchId, Pageable pageable);
}
