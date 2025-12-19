package kr.ac.ync.library.domain.users.service;

import kr.ac.ync.library.domain.users.dto.AdminUserUpdateRequest;
import kr.ac.ync.library.domain.users.dto.PasswordUpdateRequest;
import kr.ac.ync.library.domain.users.dto.UserResponse;
import kr.ac.ync.library.domain.users.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<UserResponse> getList(Pageable pageable);

    UserResponse updateMyInfo(String email, UserUpdateRequest request);

    void updatePassword(String email, PasswordUpdateRequest request);

    UserResponse adminUpdateUser(Long id, AdminUserUpdateRequest request);

    Page<UserResponse> getAdmins(Pageable pageable);

    // 관리자 페이지에서 유저 삭제
    void deleteUser(Long userId);
}
