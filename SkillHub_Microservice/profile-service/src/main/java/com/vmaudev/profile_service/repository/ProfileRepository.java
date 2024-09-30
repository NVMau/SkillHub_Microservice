package com.vmaudev.profile_service.repository;

import com.vmaudev.profile_service.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
    Optional<Profile> findByProfileId(String profileId);
    List<Profile> findByRoles(String role);

    // Tìm kiếm theo tên (firstName hoặc lastName), không phân biệt chữ hoa/chữ thường
    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}]}")
    List<Profile> findByName(String name);
    void deleteByProfileId(String profileId);

    long countByRoles(String role); // Đếm số lượng người dùng theo role





}
