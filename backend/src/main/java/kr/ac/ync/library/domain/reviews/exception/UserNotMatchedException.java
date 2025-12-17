package kr.ac.ync.library.domain.reviews.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class UserNotMatchedException extends CustomException {

    public static final CustomException EXCEPTION = new UserNotMatchedException();
    private UserNotMatchedException() {
        super(403, "본인 리뷰만 수정 및 삭제가 가능합니다");
    }

}
