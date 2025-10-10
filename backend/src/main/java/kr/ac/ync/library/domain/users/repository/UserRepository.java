package kr.ac.ync.library.domain.users.repository;

import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);       // 이메일 중복 체크

    boolean existsByUsername(String username); // 닉네임 중복체크

    boolean existsByPhone(String Phone); // 전화번호 중복체크

}