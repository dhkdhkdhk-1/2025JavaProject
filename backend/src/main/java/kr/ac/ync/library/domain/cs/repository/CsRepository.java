package kr.ac.ync.library.domain.cs.repository;

import kr.ac.ync.library.domain.cs.entity.CsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CsRepository extends JpaRepository <CsEntity, Long> {

    Page<CsEntity> findByUserId(Long userId, Pageable pageable);
}
