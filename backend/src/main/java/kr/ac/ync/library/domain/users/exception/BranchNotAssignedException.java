package kr.ac.ync.library.domain.users.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class BranchNotAssignedException extends CustomException {
    public static final BranchNotAssignedException EXCEPTION = new BranchNotAssignedException();
    private BranchNotAssignedException() {
        super(400, "매니저는 지점 할당 필수");
    }

}
