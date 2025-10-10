package kr.ac.ync.library.domain.rentals.entity;

import jakarta.persistence.*;
import kr.ac.ync.library.global.common.entity.BaseTimeEntity;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_rental_history")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class RentalHistoryEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "rental_id")
    private RentalEntity rental;

    @Column(nullable = false)
    private String actionType;

}
