package it.uniroma1.notification_service.repository;
import it.uniroma1.notification_service.model.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<NotificationEntity> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, boolean isRead);
    long countByUserIdAndIsRead(Long userId, boolean isRead);
}