package kr.ac.ync.library.domain.rentals.mapper;

import kr.ac.ync.library.domain.books.entity.BookEntity;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.entity.RentalEntity;
import kr.ac.ync.library.domain.users.entity.UserEntity;

import java.time.LocalDateTime;

public class RentalMapper
{

    public static RentalEntity toEntity(UserEntity user, BookEntity book, BranchEntity branch) {
        return RentalEntity.builder()
                .user(user)
                .book(book)
                .branch(branch)
                .rentalDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(7))
                .status("貸与中")
                .returned(false)
                .build();
    }

    public static RentalResponse toResponse(RentalEntity entity) {
        return RentalResponse.builder()
                .id(entity.getId())
                .bookId(entity.getBook().getId())
                .bookTitle(entity.getBook().getTitle())
                .userName(entity.getUser().getUsername())
                .userEmail(entity.getUser().getEmail())
                .branchName(entity.getBranch().getName())
                .rentalDate(entity.getRentalDate())
                .dueDate(entity.getDueDate())
                .returnDate(entity.getReturnDate())
                .status(entity.getStatus())
                .returned(entity.isReturned())
                .build();
    }
}
