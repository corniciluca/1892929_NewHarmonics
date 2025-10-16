package it.uniroma1.user_service.repository;

import it.uniroma1.user_service.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByUserId(Long userId);
}

// --- POSSIBLY UNUSED ---