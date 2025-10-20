package kr.ac.ync.library.domain.users.repository;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import kr.ac.ync.library.domain.users.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.IntStream;

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
        UserEntity user = UserEntity.builder().email("rnjsehsgus31@gmail.com").password(passwordEncoder.encode("1231")).role(UserRole.USER).username("이메일").build();
        userRepository.save(user);
        IntStream.rangeClosed(1, 100)
                .forEach(i -> {
                    String email = "user" + i + "@aaa.com";
                    UserEntity userEntity = UserEntity.builder()
                            .email(email)
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