package it.uniroma1.user_service.controller;

import it.uniroma1.user_service.service.FollowService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import it.uniroma1.user_service.assembler.UserModelAssembler;
import it.uniroma1.user_service.exceptions.UserNotFoundException;
import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.service.UserService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserEntity userDetails) {
        UserEntity updatedUser = userService.updateUserEntity(id, userDetails);
        
        EntityModel<UserEntity> entityModel = assembler.toModel(updatedUser);

        return ResponseEntity.ok(entityModel);
    }

    // Deletes user {id} (and all their songs, alongside removing them from the following list of all other users)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserEntity(id);
        
        return ResponseEntity.noContent().build();
    }

    // Returns all the users followed by user {id}
    @GetMapping("/{id}/followed")
    public ResponseEntity<Set<UserEntity>> getFollowedArtists(@PathVariable("id") Long id) {
        Set<UserEntity> followed = followService.getFollowedArtists(id);
        return ResponseEntity.ok(followed);
    }

    // Adds user {artistId} to the following list of user {id}
    @PostMapping("/{id}/follow/{artistId}")
    public ResponseEntity<Void> followArtist(@PathVariable Long id, @PathVariable Long artistId) {
        followService.followArtist(id, artistId);
        return ResponseEntity.ok().build();
    }

    // Removes user {artistId} from the following list of user {id}
    @DeleteMapping("/{id}/unfollow/{artistId}")
    public ResponseEntity<Void> unfollowArtist(@PathVariable Long id, @PathVariable Long artistId) {
        followService.unfollowArtist(id, artistId);
        return ResponseEntity.ok().build();
    }

}