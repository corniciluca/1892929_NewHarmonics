package it.uniroma1.user_service.assembler;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import it.uniroma1.user_service.controller.UserController;
import it.uniroma1.user_service.model.UserEntity;


import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<UserEntity, EntityModel<UserEntity>> {

    @Override
    public EntityModel<UserEntity> toModel(UserEntity UserEntity) {
        return EntityModel.of(UserEntity,
                linkTo(methodOn(UserController.class).getOneUser(UserEntity.getId())).withSelfRel(),
                linkTo(methodOn(UserController.class).getAllUsers()).withRel("all-users")
        );
    }
}