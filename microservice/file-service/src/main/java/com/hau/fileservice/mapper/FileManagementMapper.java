package com.hau.fileservice.mapper;

import com.hau.fileservice.dto.FileInfo;
import com.hau.fileservice.dto.FileResponse;
import com.hau.fileservice.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileManagementMapper {
    @Mapping(target = "id", source = "fileName")
    FileManagement toFileManagement(FileInfo fileInfo);

}
