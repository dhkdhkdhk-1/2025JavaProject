package kr.ac.ync.library.domain.rentals.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class RentalNotFoundException extends CustomException {

    public static final CustomException EXCEPTION = new RentalNotFoundException();
    private RentalNotFoundException() {
        super(404, "해당 대여 정보를 찾을 수 없습니다.");
    }
}
