package com.hau.blogService.utils;

import com.hau.blogService.custom.FilePathMultipartFile;
import com.hau.blogService.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public class FileUtils {

    public static MultipartFile convertPathToMultipartFile(String path) throws IOException {
        File f = new File(path);
        if(!f.isFile()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "File không hợp lệ", null);
        }
        return new FilePathMultipartFile(path);
    }

}

