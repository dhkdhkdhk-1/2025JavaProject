package kr.ac.ync.library.global.common.jwt.exception;


import kr.ac.ync.library.global.common.exception.CustomException;

public class TokenTypeException extends CustomException
{
    public static final CustomException EXCEPTION = new TokenTypeException();

    private TokenTypeException()
    {
        super(400, "잘못된 JWT 타입");
    }

}
