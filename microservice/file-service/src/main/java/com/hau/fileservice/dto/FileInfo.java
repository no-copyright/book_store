package com.hau.fileservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileInfo {
    private String fileName;
    private String contentType;
    private long size;
    private String md5Checksum;
    private String filePath;
    private String fileUrl;
}
