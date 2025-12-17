package kr.ac.ync.library.domain.reviews.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class DuplicateReviewException extends CustomException {

    public static final DuplicateReviewException EXCEPTION = new DuplicateReviewException();

    private DuplicateReviewException() {
        super(400, "이미 이 책에 대한 리뷰를 작성하셨습니다.");
    }
}
