package com.hau.product_service.utils;

import com.hau.product_service.custom.FilePathMultipartFile;
import com.hau.product_service.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FileUtils {

    public static MultipartFile convertPathToMultipartFile(String path) throws IOException {
        File f = new File(path);
        if(!f.isFile()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "File không hợp lệ", null);
        }
        return new FilePathMultipartFile(path);
    }

    public static List<MultipartFile> convertPathsToMultipartFiles(List<String> paths) throws IOException {
        List<MultipartFile> result = new ArrayList<>();
        for (String path : paths) {
            File f = new File(path);
            if(!f.isFile()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "File không hợp lệ", null);
            }
            result.add(convertPathToMultipartFile(path));
        }
        return result;
    }

}

