package kr.ac.ync.library.domain.rentals.service;

import kr.ac.ync.library.domain.rentals.dto.Rental;
import kr.ac.ync.library.domain.rentals.dto.RentalRegisterRequest;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;
import kr.ac.ync.library.domain.rentals.dto.RentalReturnRequest;

import java.util.List;

public interface RentalService {

    void register(RentalRegisterRequest request, Long userId);

    void returnBook(RentalReturnRequest request, Long userId);

    List<RentalResponse> getList();

    List<RentalResponse> getListByUser(Long userId);

    RentalResponse findById(Long id);
}
