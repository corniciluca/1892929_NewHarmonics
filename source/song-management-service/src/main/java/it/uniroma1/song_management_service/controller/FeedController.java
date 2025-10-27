package it.uniroma1.song_management_service.controller;

import it.uniroma1.song_management_service.model.Song;
import it.uniroma1.song_management_service.service.FeedService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    // Returns the feed of the CURRENT authenticated user
    @GetMapping // 👈 New path is just /feed
    public ResponseEntity<List<Song>> getUserFeed(
            @RequestHeader("X-User-Id") String userId // 👈 Get ID from header
    ) {
        try {
            Long authenticatedId = Long.parseLong(userId);
            // The service call is updated to pass the authenticated ID
            return ResponseEntity.ok(feedService.getFeedForUser(authenticatedId));
        } catch (NumberFormatException e) {
            // Should not happen if JWT is correctly generated
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

//    @GetMapping("/{id}")
//    public List<Song> getUserFeed(@PathVariable("id") Long id) {
//        return feedService.getFeedForUser(id);
//    }
}
