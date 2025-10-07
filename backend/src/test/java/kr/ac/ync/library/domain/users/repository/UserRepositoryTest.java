package kr.ac.ync.library.domain.users.repository;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.enums.UserRole;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest
{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testInertUsers()
    {
        IntStream.rangeClosed(1, 100)
                .forEach(i -> {
                    String email = "user" + i + "@aaa.com";
                    UserEntity userEntity = UserEntity.builder()
                            .email(email)
                            .phone("010-"+i)
                            .password(passwordEncoder.encode("1111"))
                            .username("USER" + i)
                            .role(UserRole.USER)
                            .build();
                    userRepository.save(userEntity);
                });
    }

    @Test
    void testUpdateMember()
    {
        userRepository.findById(100L)
                .map(UserEntity ->
                {
                    User user = UserMapper.toDTO(UserEntity);
                    user.setRole(UserRole.ADMIN);
                    userRepository.save(UserMapper.toEntity(user));
                    return true;
                });
    }

}