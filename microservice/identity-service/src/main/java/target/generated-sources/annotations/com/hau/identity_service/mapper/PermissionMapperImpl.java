package com.hau.identity_service.mapper;

import com.hau.identity_service.dto.request.PermissionCreationRequest;
import com.hau.identity_service.dto.response.PermissionResponse;
import com.hau.identity_service.entity.Permission;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-22T22:05:43+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class PermissionMapperImpl implements PermissionMapper {

    @Override
    public Permission toPermission(PermissionCreationRequest permissionCreationRequest) {
        if ( permissionCreationRequest == null ) {
            return null;
        }

        Permission.PermissionBuilder permission = Permission.builder();

        permission.name( permissionCreationRequest.getName() );
        permission.description( permissionCreationRequest.getDescription() );

        return permission.build();
    }

    @Override
    public PermissionResponse toPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.name( permission.getName() );
        permissionResponse.description( permission.getDescription() );

        return permissionResponse.build();
    }
}
