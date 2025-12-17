package kr.ac.ync.library.domain.rentals.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RentalResponse {

    private Long id;

    private Long bookId;       // ✅ 추가: 프론트에서 bookId 필요
    private String bookTitle;

    private String userName;
    private String userEmail;
    private String branchName;

    private LocalDateTime rentalDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;

    private String status;
    private boolean returned;
}
