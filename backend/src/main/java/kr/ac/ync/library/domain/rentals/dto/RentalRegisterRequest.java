package kr.ac.ync.library.domain.rentals.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentalRegisterRequest {

    @NotNull(message = "도서 ID는 필수입니다.")
    private Long bookId;

    @NotNull(message = "지점 ID는 필수입니다.")
    private Long branchId;
}
