package com.hau.notificationservice.repository;

import com.hau.notificationservice.entity.FcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    List<FcmToken> findFcmTokenByUserId(Integer userId);
}
