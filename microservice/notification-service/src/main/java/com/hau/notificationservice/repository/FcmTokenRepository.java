package com.hau.notificationservice.repository;

import com.hau.notificationservice.entity.FcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    List<FcmToken> findFcmTokenByUserId(Integer userId);
    Optional<FcmToken> findByUserIdAndToken(Integer userId, String token);
}
