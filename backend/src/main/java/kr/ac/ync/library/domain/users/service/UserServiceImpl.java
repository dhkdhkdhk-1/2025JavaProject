package kr.ac.ync.library.domain.users.service;

import kr.ac.ync.library.domain.board.repository.BoardRepository;
import kr.ac.ync.library.domain.branch.entity.BranchEntity;
import kr.ac.ync.library.domain.branch.exception.BranchNotFoundException;
import kr.ac.ync.library.domain.branch.repository.BranchRepository;
import kr.ac.ync.library.domain.users.dto.*;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import kr.ac.ync.library.domain.users.exception.BranchNotAssignedException;
import kr.ac.ync.library.domain.users.exception.InvalidPasswordException;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;
    private final BranchRepository branchRepository;

    @Override
    public Page<UserResponse> getList(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toResponse);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserResponse updateMyInfo(String email, UserUpdateRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (!request.getPassword().equals(request.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호 확인이 일치하지 않습니다.");
        }

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        user.setUsername(request.getUsername());
        userRepository.saveAndFlush(user);

        // 게시판 작성자명도 변경
        boardRepository.updateUsernameByUserId(user.getId(), request.getUsername());

        return new UserResponse(user);
    }

    @Override
    public void updatePassword(String email, PasswordUpdateRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw InvalidPasswordException.EXCEPTION;
        }

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserResponse adminUpdateUser(Long id, AdminUserUpdateRequest request) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> UserNotFoundException.EXCEPTION);
        user.changeUsername(request.getUsername());
        user.changeRole(request.getRole());

        if(request.getRole() == UserRole.MANAGER) {
            if(request.getBranchId() == null) {
                throw BranchNotAssignedException.EXCEPTION;
            }

            BranchEntity branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> BranchNotFoundException.EXCEPTION);

            user.setBranch(branch);
        } else {
            user.setBranch(null);
        }

        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public Page<UserResponse> getAdmins(Pageable pageable) {
        return userRepository.findAdmins(pageable).map(UserMapper::toResponse);
    }
}
