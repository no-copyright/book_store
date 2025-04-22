package com.hau.identity_service.mapper;

import com.hau.identity_service.dto.request.UserCreateRequest;
import com.hau.identity_service.dto.request.UserUpdateInfoRequest;
import com.hau.identity_service.dto.request.UserUpdateRequest;
import com.hau.identity_service.dto.response.PermissionResponse;
import com.hau.identity_service.dto.response.RoleResponse;
import com.hau.identity_service.dto.response.UserResponse;
import com.hau.identity_service.entity.Permission;
import com.hau.identity_service.entity.Role;
import com.hau.identity_service.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-22T22:05:43+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreateRequest userCreateRequest) {
        if ( userCreateRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.username( userCreateRequest.getUsername() );
        user.password( userCreateRequest.getPassword() );
        user.email( userCreateRequest.getEmail() );
        user.profileImage( userCreateRequest.getProfileImage() );

        return user.build();
    }

    @Override
    public void toUserUpdateRequest(User user, UserUpdateRequest userUpdateRequest) {
        if ( userUpdateRequest == null ) {
            return;
        }

        if ( userUpdateRequest.getPassword() != null ) {
            user.setPassword( userUpdateRequest.getPassword() );
        }
        if ( userUpdateRequest.getEmail() != null ) {
            user.setEmail( userUpdateRequest.getEmail() );
        }
        if ( userUpdateRequest.getProfileImage() != null ) {
            user.setProfileImage( userUpdateRequest.getProfileImage() );
        }
    }

    @Override
    public void toUserUpdateInfoRequest(User user, UserUpdateInfoRequest userUpdateInfoRequest) {
        if ( userUpdateInfoRequest == null ) {
            return;
        }

        if ( userUpdateInfoRequest.getEmail() != null ) {
            user.setEmail( userUpdateInfoRequest.getEmail() );
        }
        if ( userUpdateInfoRequest.getProfileImage() != null ) {
            user.setProfileImage( userUpdateInfoRequest.getProfileImage() );
        }
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        if ( user.getId() != null ) {
            userResponse.id( String.valueOf( user.getId() ) );
        }
        userResponse.username( user.getUsername() );
        userResponse.email( user.getEmail() );
        userResponse.profileImage( user.getProfileImage() );
        userResponse.roles( roleSetToRoleResponseSet( user.getRoles() ) );

        return userResponse.build();
    }

    protected PermissionResponse permissionToPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.name( permission.getName() );
        permissionResponse.description( permission.getDescription() );

        return permissionResponse.build();
    }

    protected Set<PermissionResponse> permissionSetToPermissionResponseSet(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionResponse> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Permission permission : set ) {
            set1.add( permissionToPermissionResponse( permission ) );
        }

        return set1;
    }

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.name( role.getName() );
        roleResponse.description( role.getDescription() );
        roleResponse.permissions( permissionSetToPermissionResponseSet( role.getPermissions() ) );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
