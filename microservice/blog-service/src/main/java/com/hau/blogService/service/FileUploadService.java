package com.hau.blogService.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    String uploadFileAndGetUrl(MultipartFile file, String fileTypeDescription); // Uploads a file and returns its URL
}
