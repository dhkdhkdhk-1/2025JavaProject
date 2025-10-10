package kr.ac.ync.library.domain.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JsonWebTokenResponse
{
    private String accessToken;
    private String refreshToken;
}
