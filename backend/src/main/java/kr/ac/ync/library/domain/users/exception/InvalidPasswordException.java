package kr.ac.ync.library.domain.users.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class InvalidPasswordException extends CustomException {
    public static final CustomException EXCEPTION = new InvalidPasswordException();
    private InvalidPasswordException(){
      super(400, "비밀번호가 일치하지 않습니다.");
    }
}
