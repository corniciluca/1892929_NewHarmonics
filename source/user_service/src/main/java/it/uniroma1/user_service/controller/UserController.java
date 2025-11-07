package it.uniroma1.user_service.controller;

import it.uniroma1.user_service.service.FollowService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import it.uniroma1.user_service.assembler.UserModelAssembler;
import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.service.UserService;

import java.util.List;
import java.util.Set;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserModelAssembler assembler;
    private final FollowService followService;

    public UserController(UserService userService, FollowService followService, UserModelAssembler assembler) {
        this.userService = userService;
        this.followService = followService;
        this.assembler = assembler;
    }

    // Returns all users
    @GetMapping
    public CollectionModel<EntityModel<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.findAllUsers();
        return assembler.toCollectionModel(users);
    }


    @GetMapping("/{artistId}/followers")
    public ResponseEntity<Set<UserEntity>> getFollowers(@PathVariable Long artistId) {
        Set<UserEntity> followers = followService.getFollowers(artistId);
        return ResponseEntity.ok(followers);
    }
    
    // Returns user {id}
    @GetMapping("/{id}")
    public EntityModel<UserEntity> getOneUser(@PathVariable("id") Long id) {
        UserEntity UserEntity = userService.findUserById(id);
        return assembler.toModel(UserEntity);
    }

    // Creates a new user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserEntity newUser) {
        UserEntity savedUser = userService.createUserEntity(newUser);
        
        EntityModel<UserEntity> entityModel = assembler.toModel(savedUser);

        return ResponseEntity
                .created(entityModel.getRequiredLink("self").toUri())
                .body(entityModel);
    }

    // Updates user {id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        // Extract standard UserEntity fields
        UserEntity userDetails = new UserEntity();
        userDetails.setUsername(updates.get("username"));
        userDetails.setEmail(updates.get("email"));
        // Add role if you allow updating it here, e.g.:
        // if (updates.get("role") != null) userDetails.setRole(Role.valueOf(updates.get("role")));

        // Extract password fields
        String currentPassword = updates.get("currentPassword");
        String newPassword = updates.get("newPassword");

        try {
            // Call new service method
            UserEntity updatedUser = userService.updateUserEntity(id, userDetails, currentPassword, newPassword);
            EntityModel<UserEntity> entityModel = assembler.toModel(updatedUser);
            return ResponseEntity.ok(entityModel);
        } catch (IllegalArgumentException e) {
            // Catch password validation errors and return 400 Bad Request
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Deletes user {id} (and all their songs, alongside removing them from the following list of all other users)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserEntity(id);
        
        return ResponseEntity.noContent().build();
    }

    // 1. Endpoint to get followed artists for the CURRENT user
    // The FeedService is calling this endpoint via the gateway, but it needs to include the X-User-Id header for the gateway to validate the request.
    @GetMapping("/{id}/followed")
    public ResponseEntity<Set<UserEntity>> getFollowedArtists(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") String headerUserId // Add the header to check
    ) {
        if (!String.valueOf(id).equals(headerUserId)) {
            // 🚨 Security Check: Ensure path ID matches authenticated user ID
            return ResponseEntity.status(403).build();
        }

        Set<UserEntity> followed = followService.getFollowedArtists(id);
        return ResponseEntity.ok(followed);
    }

    // 2. Endpoint to follow an artist (only the current user)
    @PostMapping("/follow/{artistId}") // Note: Removed {id} from path
    public ResponseEntity<Void> followArtist(
            @RequestHeader("X-User-Id") String followerId,
            @PathVariable Long artistId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(followerId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(401).build(); // Invalid ID header
        }

        // Optional: Add logic here to check if the current user is a LISTENER
        // if (!userService.getUserRole(currentUserId).equals(Role.LISTENER)) {
        //     return ResponseEntity.status(403).body("Only LISTENERs can follow.");
        // }

        followService.followArtist(currentUserId, artistId);
        return ResponseEntity.ok().build();
    }

    // 3. Endpoint to unfollow an artist (only the current user)
    @DeleteMapping("/unfollow/{artistId}") // Note: Removed {id} from path
    public ResponseEntity<Void> unfollowArtist(
            @RequestHeader("X-User-Id") String followerId,
            @PathVariable Long artistId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(followerId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(401).build();
        }

        followService.unfollowArtist(currentUserId, artistId);
        return ResponseEntity.ok().build();
    }

}