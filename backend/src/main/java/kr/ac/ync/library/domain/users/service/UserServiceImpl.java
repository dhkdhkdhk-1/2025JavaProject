package kr.ac.ync.library.domain.users.service;

import kr.ac.ync.library.domain.users.dto.*;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.exception.InvalidPasswordException;
import kr.ac.ync.library.domain.users.exception.UserNotFoundException;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getList(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toResponse);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse updateMyInfo(String email, UserUpdateRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        user.changeUsername(request.getUsername());
        userRepository.save(user);

        return UserMapper.toResponse(user);
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
    public UserResponse adminUpdate(Long id, AdminUserUpdateRequest request) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> UserNotFoundException.EXCEPTION);
        user.changeUsername(request.getUsername());
        user.changeRole(request.getRole());
        userRepository.save(user);
        return UserMapper.toResponse(user);
    }
}
