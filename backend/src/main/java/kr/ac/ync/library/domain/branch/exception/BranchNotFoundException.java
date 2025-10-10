package kr.ac.ync.library.domain.branch.exception;
import kr.ac.ync.library.global.common.exception.CustomException;

public class BranchNotFoundException extends CustomException {
    public static final CustomException EXCEPTION = new BranchNotFoundException();
    private BranchNotFoundException(){
        super(404, "해당 지점을 찾을 수 없습니다.");
    }

}
