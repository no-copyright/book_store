package com.hau.fileservice.repository;

import com.hau.fileservice.entity.FileManagement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileManagementRepository extends MongoRepository<FileManagement, String> {

}
