package com.hau.blogService.repository;

import com.hau.blogService.config.AuthenticationRequestInterceptor;
import com.hau.blogService.config.FeignMultipartSupportConfig;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.FileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@Repository
@FeignClient(name = "file-service", url = "${app.file-service.url}",
        configuration = {AuthenticationRequestInterceptor.class, FeignMultipartSupportConfig.class})
public interface FileServiceClientRepository {
    @PostMapping(value = "/file/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<FileResponse> uploadFile(@RequestPart("file") MultipartFile file);

    @DeleteMapping("/file/media/{fileName}")
    ApiResponse<FileResponse> deleteFile(@PathVariable String fileName);
}
