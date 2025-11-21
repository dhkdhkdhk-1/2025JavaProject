package kr.ac.ync.library.domain.cs.repository;

import kr.ac.ync.library.domain.cs.entity.CsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CsRepository extends JpaRepository <CsEntity, Long> {

}
