package it.uniroma1.notification_service.controller;

import it.uniroma1.notification_service.model.NotificationEntity;
import it.uniroma1.notification_service.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getUserNotifications(
            @RequestHeader("X-User-Id") String userId
    ) {
        try {
            Long userIdLong = Long.parseLong(userId);
            List<NotificationEntity> notifications = notificationService.getUserNotifications(userIdLong);
            return ResponseEntity.ok(notifications);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(
            @RequestHeader("X-User-Id") String userId
    ) {
        try {
            Long userIdLong = Long.parseLong(userId);
            List<NotificationEntity> notifications = notificationService.getUnreadNotifications(userIdLong);
            return ResponseEntity.ok(notifications);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("X-User-Id") String userId
    ) {
        try {
            Long userIdLong = Long.parseLong(userId);
            long count = notificationService.getUnreadCount(userIdLong);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId
    ) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestHeader("X-User-Id") String userId
    ) {
        try {
            Long userIdLong = Long.parseLong(userId);
            notificationService.markAllAsRead(userIdLong);
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid user ID"));
        }
    }
}
