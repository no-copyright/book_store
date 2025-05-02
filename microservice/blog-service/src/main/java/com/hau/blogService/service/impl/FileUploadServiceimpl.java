package com.hau.blogService.service.impl;

import com.hau.blogService.exception.AppException;
import com.hau.blogService.repository.FileServiceClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileUploadServiceimpl implements com.hau.blogService.service.FileUploadService {
    private final FileServiceClientRepository fileServiceClientRepository;

    public String uploadFileAndGetUrl(MultipartFile file, String fileTypeDescription) {
        if (file == null || file.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "File " + fileTypeDescription + " không được để trống", null);
        }
        try {
            var fileResponse = fileServiceClientRepository.uploadFile(file);
            if (fileResponse != null && fileResponse.getResult() != null && fileResponse.getResult().getUrl() != null) {
                return fileResponse.getResult().getUrl(); // Return only the relative URL path
            } else {
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không nhận được thông tin hợp lệ từ file-service cho " + fileTypeDescription, null);
            }
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải lên file " + fileTypeDescription, e);
        }
    }
}
