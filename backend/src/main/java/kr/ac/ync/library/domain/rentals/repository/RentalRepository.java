package kr.ac.ync.library.domain.rentals.repository;

import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RentalRepository extends JpaRepository<RentalEntity, Long> {

    @Query("SELECT r FROM RentalEntity r WHERE r.user.id = :userId")
    List<RentalEntity> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM RentalEntity r " +
            "WHERE r.returnDate IS NULL " +
            "AND r.dueDate < CURRENT_TIMESTAMP")
    List<RentalEntity> findOverdueRentals();
}
