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
    
    @GetMapping("/{id}")
    public EntityModel<UserEntity> getOneUser(@PathVariable("id") Long id) {
        UserEntity UserEntity = userService.findUserById(id);
        return assembler.toModel(UserEntity);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserEntity newUser) {
        UserEntity savedUser = userService.createUserEntity(newUser);
        
        EntityModel<UserEntity> entityModel = assembler.toModel(savedUser);

        return ResponseEntity
                .created(entityModel.getRequiredLink("self").toUri())
                .body(entityModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        UserEntity userDetails = new UserEntity();
        userDetails.setUsername(updates.get("username"));
        userDetails.setEmail(updates.get("email"));

        String currentPassword = updates.get("currentPassword");
        String newPassword = updates.get("newPassword");

        try {
            UserEntity updatedUser = userService.updateUserEntity(id, userDetails, currentPassword, newPassword);
            EntityModel<UserEntity> entityModel = assembler.toModel(updatedUser);
            return ResponseEntity.ok(entityModel);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserEntity(id);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/followed")
    public ResponseEntity<Set<UserEntity>> getFollowedArtists(
            @PathVariable("id") Long id,
            @RequestHeader("X-User-Id") String headerUserId 
    ) {
        if (!String.valueOf(id).equals(headerUserId)) {
            return ResponseEntity.status(403).build();
        }

        Set<UserEntity> followed = followService.getFollowedArtists(id);
        return ResponseEntity.ok(followed);
    }

    @PostMapping("/follow/{artistId}") 
    public ResponseEntity<Void> followArtist(
            @RequestHeader("X-User-Id") String followerId,
            @PathVariable Long artistId
    ) {
        Long currentUserId;
        try {
            currentUserId = Long.parseLong(followerId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(401).build();
        }

        followService.followArtist(currentUserId, artistId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow/{artistId}")
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