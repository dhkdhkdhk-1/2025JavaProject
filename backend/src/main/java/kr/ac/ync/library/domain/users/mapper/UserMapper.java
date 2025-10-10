package kr.ac.ync.library.domain.users.mapper;

import kr.ac.ync.library.domain.users.dto.User;
import kr.ac.ync.library.domain.users.entity.UserEntity;

public class UserMapper {
    public static User toDTO(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .phone(entity.getPhone())
                .role(entity.getRole())
                .build();
    }

    public static UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
