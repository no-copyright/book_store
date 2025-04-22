package com.hau.fileservice.dto;

import org.springframework.core.io.Resource;

public record FileData(String contentType, Resource resource) {

}
