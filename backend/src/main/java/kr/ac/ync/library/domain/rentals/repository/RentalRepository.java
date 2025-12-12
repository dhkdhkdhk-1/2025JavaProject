package kr.ac.ync.library.domain.rentals.repository;

import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RentalRepository extends JpaRepository<RentalEntity, Long> {

    List<RentalEntity> findByUserId(Long userId);

    @Query("""
        SELECT r FROM RentalEntity r
        WHERE r.returned = false
        AND r.dueDate < CURRENT_TIMESTAMP
    """)
    List<RentalEntity> findOverdueRentals();
}
