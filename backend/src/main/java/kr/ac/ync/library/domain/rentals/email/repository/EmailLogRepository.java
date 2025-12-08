package kr.ac.ync.library.domain.rentals.email.repository;

import kr.ac.ync.library.domain.rentals.email.entity.EmailLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLogEntity, Long> {

}
