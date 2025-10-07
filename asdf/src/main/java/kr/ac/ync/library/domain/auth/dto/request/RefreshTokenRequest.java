package kr.ac.ync.library.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenRequest
{

    @NotBlank(message = "ㅇㅇ")
    private String refreshToken;

}
