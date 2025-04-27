package com.hau.fileservice.repository;

import com.hau.fileservice.dto.FileInfo;
import com.hau.fileservice.entity.FileManagement;
import com.hau.fileservice.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class FileRepository {
    @Value("${app.file.storage-dir}")
    private String storageDir;
    private final FileManagementRepository fileManagementRepository;
    public FileInfo uploadFile(MultipartFile file) throws IOException {
        Path path = Paths.get(storageDir);
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = path.resolve(fileName).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        String contentType = file.getContentType();
        if (originalFileName != null && originalFileName.toLowerCase().endsWith(".jfif")) {
            // Ghi đè Content-Type thành image/jpeg chỉ cho file .jfif
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }
        return FileInfo.builder()
                .fileName(fileName)
                .size(file.getSize())
                .contentType(contentType)
                .md5Checksum(DigestUtils.md5DigestAsHex(file.getInputStream()))
                .filePath(filePath.toString())
                .fileUrl(fileName)
                .build();
    }

    public Resource read(FileManagement fileManagement) throws IOException {
        var data = Files.readAllBytes(Path.of(fileManagement.getFilePath()));
        return new ByteArrayResource(data);
    }

    public void delete(String filename) throws IOException {
        Path filePath = Path.of(storageDir, filename); // Cách tốt hơn để kết hợp đường dẫn
        boolean isDeleted = Files.deleteIfExists(filePath);
        if(!isDeleted) {
            throw new AppException(HttpStatus.NOT_FOUND, "Xóa thất bại", filePath);
        }
        fileManagementRepository.deleteById(filename);

    }
}
