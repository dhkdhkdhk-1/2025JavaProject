package kr.ac.ync.library.domain.users.repository;

import kr.ac.ync.library.domain.users.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);       // 이메일 중복 체크

    boolean existsByUsername(String username); // 닉네임 중복체크

    @Query("SELECT u FROM UserEntity u WHERE u.role IN ('ADMIN')")
    Page<UserEntity> findAdmins(Pageable pageable);
}