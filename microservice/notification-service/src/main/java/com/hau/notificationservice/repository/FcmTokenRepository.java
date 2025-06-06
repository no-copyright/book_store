package com.hau.notificationservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.hau.notificationservice.entity.FcmToken;

@Repository
public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    List<FcmToken> findFcmTokenByUserId(Integer userId);

    Optional<FcmToken> findByUserIdAndToken(Integer userId, String token);
}
