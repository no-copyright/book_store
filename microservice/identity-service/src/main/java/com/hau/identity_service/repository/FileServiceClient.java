package com.hau.identity_service.repository;

import com.hau.identity_service.config.AuthenticationRequestInterceptor;
import com.hau.identity_service.config.FeignMultipartSupportConfig;
import com.hau.identity_service.dto.response.ApiResponse;
import com.hau.identity_service.dto.response.FileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "file-service", url = "${app.file-service.url}",
        configuration = {AuthenticationRequestInterceptor.class, FeignMultipartSupportConfig.class})
public interface FileServiceClient {
    @PostMapping(value = "/file/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<FileResponse> uploadFile(@RequestPart("file") MultipartFile file);

    @DeleteMapping
    ApiResponse<FileResponse> deleteFile(@RequestPart("fileUrl") String fileUrl);
}
