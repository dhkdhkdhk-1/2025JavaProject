package kr.ac.ync.library.domain.auth.service;


import kr.ac.ync.library.domain.auth.dto.request.AuthenticationRequest;
import kr.ac.ync.library.domain.auth.dto.response.JsonWebTokenResponse;

public interface AuthService
{
    JsonWebTokenResponse auth(AuthenticationRequest request);

    JsonWebTokenResponse refresh(String token);


}
