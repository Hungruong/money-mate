package com.money.mate.user_service.repository;

import com.money.mate.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByFirebaseUid(String firebaseUid);

    Optional<User> findByPhoneNumber(String phoneNumber);

}
