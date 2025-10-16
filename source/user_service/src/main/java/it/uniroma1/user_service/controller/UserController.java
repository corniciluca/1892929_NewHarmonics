package it.uniroma1.user_service.controller;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserModelAssembler assembler;

    public UserController(UserService userService, UserModelAssembler assembler) {
        this.userService = userService;
        this.assembler = assembler;
    }

    @GetMapping
    public CollectionModel<EntityModel<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.findAllUsers();
        return assembler.toCollectionModel(users);
    }

    @GetMapping("/{id}")
    public EntityModel<UserEntity> getOneUser(@PathVariable Long id) {
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
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserEntity userDetails) {
        UserEntity updatedUser = userService.updateUserEntity(id, userDetails);
        
        EntityModel<UserEntity> entityModel = assembler.toModel(updatedUser);

        return ResponseEntity.ok(entityModel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserEntity(id);
        
        return ResponseEntity.noContent().build();
    }
}