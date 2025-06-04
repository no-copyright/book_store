package com.hau.blogService.custom;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

public class FilePathMultipartFile implements MultipartFile {
    private final File file;
    private final String contentType;

    public FilePathMultipartFile(String filePath) throws IOException {
        this.file = new File(filePath);
        this.contentType = Files.probeContentType(file.toPath());
    }

    @Override
    @NonNull
    public String getName() {
        return file.getName();
    }

    @Override
    @Nullable
    public String getOriginalFilename() {
        return file.getName();
    }

    @Override
    @Nullable
    public String getContentType() {
        return this.contentType;
    }

    @Override
    public boolean isEmpty() {
        return file.length() == 0;
    }

    @Override
    public long getSize() {
        return file.length();
    }

    @Override
    @NonNull
    public byte[] getBytes() throws IOException {
        return Files.readAllBytes(file.toPath());
    }

    @Override
    @NonNull
    public InputStream getInputStream() throws IOException {
        return new FileInputStream(file);
    }

    @Override
    public void transferTo(@NonNull File dest) throws IOException, IllegalStateException {
        Files.copy(file.toPath(), dest.toPath());
    }
}
