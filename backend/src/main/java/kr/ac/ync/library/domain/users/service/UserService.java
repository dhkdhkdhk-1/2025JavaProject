package kr.ac.ync.library.domain.users.service;

import kr.ac.ync.library.domain.users.dto.AdminUserUpdateRequest;
import kr.ac.ync.library.domain.users.dto.PasswordUpdateRequest;
import kr.ac.ync.library.domain.users.dto.UserResponse;
import kr.ac.ync.library.domain.users.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserResponse> getList(Pageable pageable);
    void delete(Long id);

    UserResponse updateMyInfo(String email, UserUpdateRequest request);

    void updatePassword(String email, PasswordUpdateRequest request);

    UserResponse adminUpdate(Long id, AdminUserUpdateRequest request);
}
