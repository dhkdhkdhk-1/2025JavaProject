package kr.ac.ync.library.domain.users.service;

import kr.ac.ync.library.domain.users.entity.UserEntity;
import kr.ac.ync.library.domain.users.entity.enums.UserRole;
import kr.ac.ync.library.domain.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 테스트 전에 매니저와 어드민 데이터를 추가
    @BeforeEach
    public void setUp() {
        addDummyManagersAndAdmins();
    }

    // 매니저와 어드민 더미 데이터 추가
    private void addDummyManagersAndAdmins() {
        // 비밀번호 암호화
        String encodedPasswordManager = passwordEncoder.encode("1234");
        String encodedPasswordAdmin = passwordEncoder.encode("1234");

        // MANAGER (매니저)
        UserEntity manager = UserEntity.builder()
                .username("manager1")
                .email("manager1@example.com")
                .password(encodedPasswordManager)
                .role(UserRole.MANAGER)
                .build();

        // ADMIN (관리자)
        UserEntity admin = UserEntity.builder()
                .username("admin1")
                .email("admin1@example.com")
                .password(encodedPasswordAdmin)
                .role(UserRole.ADMIN)
                .build();

        // 데이터베이스에 저장
        userRepository.save(manager);
        userRepository.save(admin);
    }

    @Test
    public void testAddDummyManagersAndAdmins() {
        // MANAGER 데이터가 존재하는지 확인
        UserEntity manager = userRepository.findByEmail("manager1@example.com").orElse(null);
        assertEquals("manager1", manager.getUsername());
        assertEquals(UserRole.MANAGER, manager.getRole());

        // ADMIN 데이터가 존재하는지 확인
        UserEntity admin = userRepository.findByEmail("admin1@example.com").orElse(null);
        assertEquals("admin1", admin.getUsername());
        assertEquals(UserRole.ADMIN, admin.getRole());
    }
}
