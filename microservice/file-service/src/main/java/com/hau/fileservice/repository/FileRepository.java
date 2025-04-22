package com.hau.fileservice.repository;

import com.hau.fileservice.dto.ApiResponse;
import com.hau.fileservice.dto.FileInfo;
import com.hau.fileservice.entity.FileManagement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public class FileRepository {
    @Value("${app.file.storage-dir}")
    private String storageDir;

    public FileInfo uploadFile(MultipartFile file) throws IOException {

        Path path = Paths.get(storageDir);
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = path.resolve(fileName).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return FileInfo.builder()
                .fileName(fileName)
                .size(file.getSize())
                .contentType(file.getContentType())
                .md5Checksum(DigestUtils.md5DigestAsHex(file.getInputStream()))
                .filePath(filePath.toString())
                .fileUrl(fileName)
                .build();
    }

    public Resource read(FileManagement fileManagement) throws IOException {
        var data = Files.readAllBytes(Path.of(fileManagement.getFilePath()));
        return new ByteArrayResource(data);
    }
}
