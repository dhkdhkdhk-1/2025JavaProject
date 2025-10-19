package kr.ac.ync.library.domain.rentals.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentalReturnRequest {
    @NotNull(message = "대여 ID는 필수입니다.")
    private Long rentalId;
}
