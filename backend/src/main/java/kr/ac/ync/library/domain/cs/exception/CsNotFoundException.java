package kr.ac.ync.library.domain.cs.exception;

import kr.ac.ync.library.global.common.exception.CustomException;

public class CsNotFoundException extends CustomException
{
    public static final CustomException EXCEPTION = new CsNotFoundException();
    private CsNotFoundException(){
        super(404, "해당 문의 글을 찾을 수 없습니다");
    }
}
