package kr.ac.ync.library.domain.users.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class UserNotFoundException extends CustomException {
    public static final CustomException EXCEPTION = new UserNotFoundException();
    private UserNotFoundException() {
        super(404, "해당 회원 정보를 찾을 수 없습니다.");
    }
}
