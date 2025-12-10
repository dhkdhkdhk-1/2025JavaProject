package kr.ac.ync.library.domain.cs.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class CsAccessDenyException extends CustomException {
    public static final CsAccessDenyException EXCEPTION = new CsAccessDenyException();
    private CsAccessDenyException() {
        super(403, "본인이 작성한 글이 아닙니다");
    }
}
