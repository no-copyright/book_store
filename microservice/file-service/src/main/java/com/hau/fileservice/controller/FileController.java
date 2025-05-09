package com.hau.fileservice.controller;

import com.hau.fileservice.dto.ApiResponse;
import com.hau.fileservice.dto.FileResponse;
import com.hau.fileservice.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/media")
    public ResponseEntity<ApiResponse<FileResponse>> uploadFile(@RequestPart("file") MultipartFile file) throws IOException {
        ApiResponse<FileResponse> apiResponse = fileService.uploadFile(file);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/media/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        var fileData = fileService.downloadFile(fileName);
        var fileManagement = fileService.getFileManagement(fileName);

        String originalFileName = fileManagement.getId();
        String contentType = fileData.contentType();
        if (contentType == null) contentType = "application/octet-stream";

        // Các loại content type cho phép hiển thị trên browser
        boolean isInlineDisplay =
                contentType.startsWith("image/")
                        || contentType.startsWith("video/");

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType);

        if (!isInlineDisplay) {
            // Các loại file khác sẽ ép tải về
            responseBuilder.header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + originalFileName + "\"");
        }
        return responseBuilder.body(fileData.resource());
    }

    @DeleteMapping("/media/{fileName}")
    public void deleteFile(@PathVariable String fileName) throws IOException {
        fileService.deleteFile(fileName);
    }
}
