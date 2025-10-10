package kr.ac.ync.library.domain.reviews.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class ReviewNotFoundException extends CustomException
{
    public static final CustomException EXCEPTION = new ReviewNotFoundException();
    private ReviewNotFoundException(){
        super(404, "해당 리뷰를 찾을 수 없습니다");
    }
}
