package kr.ac.ync.library.global.common.exception.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorResponse {
    private int status;
    private String message;
}
