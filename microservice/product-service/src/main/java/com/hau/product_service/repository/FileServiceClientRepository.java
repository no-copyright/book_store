package com.hau.product_service.repository;

import com.hau.product_service.config.AuthenticationRequestInterceptor;
import com.hau.product_service.config.FeignMultipartSupportConfig;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.FileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "file-service", url = "${app.file-service.url}",
        configuration = {AuthenticationRequestInterceptor.class, FeignMultipartSupportConfig.class})
public interface FileServiceClientRepository {
    @PostMapping(value = "/file/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<FileResponse> uploadFile(@RequestPart("file") MultipartFile file);
}
