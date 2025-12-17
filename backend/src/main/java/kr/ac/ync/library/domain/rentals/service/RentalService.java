package kr.ac.ync.library.domain.rentals.service;

import kr.ac.ync.library.domain.rentals.dto.RentalRegisterRequest;
import kr.ac.ync.library.domain.rentals.dto.RentalResponse;

import java.util.List;

public interface RentalService {

    void register(RentalRegisterRequest request, Long userId);

    // 🔥 관리자 반납 처리
    void approveReturn(Long rentalId);

    List<RentalResponse> getList();
    List<RentalResponse> getListByUser(Long userId);
    List<RentalResponse> findOverdueRentals();
    RentalResponse findById(Long id);
}
