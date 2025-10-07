package kr.ac.ync.library.domain.books.exception;
import kr.ac.ync.library.global.common.exception.CustomException;

public class BookNotFoundException extends CustomException {
    public static final CustomException EXCEPTION = new BookNotFoundException();
    private BookNotFoundException(){
        super(404, "해당 책을 찾을 수 없습니다.");
    }

}
