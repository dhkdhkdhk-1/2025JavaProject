package kr.ac.ync.library.global.common.security;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.global.common.security.auth.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserSecurity
{
    public User getUser()
    {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        return userDetails.getUser();
    }
}
