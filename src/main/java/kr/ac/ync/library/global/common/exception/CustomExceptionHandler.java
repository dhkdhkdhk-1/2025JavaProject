package kr.ac.ync.library.global.common.exception;

import kr.ac.ync.library.global.common.exception.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity handlerValidException(MethodArgumentNotValidException e) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(field -> field.getDefaultMessage())
                .orElse("잘못된 요청입니다.");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ErrorResponse(HttpStatus.BAD_REQUEST.value(), message)
                );

    }

    @ExceptionHandler(CustomException.class)
    protected ResponseEntity handlerCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getStatus())
                .body(
                        new ErrorResponse(e.getStatus(), e.getMessage())
                );
    }
}
