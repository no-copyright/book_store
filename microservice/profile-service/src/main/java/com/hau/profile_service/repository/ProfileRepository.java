package com.hau.profile_service.repository;

import com.hau.profile_service.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Page<Profile> findByUserId(Integer userId,
                               Pageable pageable);
}
