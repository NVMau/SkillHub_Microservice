package com.vmaudev.enrollment_service.repository;

import com.vmaudev.enrollment_service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(name = "profile-client", url = "${profile.service.url}")
public interface ProfileClient {
    @GetMapping("/api/profiles/user/register-course/{userId}")
    ProfileResponse getUserById(@PathVariable("userId") String userId, @RequestHeader("Authorization") String token);

    @PutMapping("/api/profiles/user/{profileId}")
    void updateUserProfile(@PathVariable("profileId") String id, @RequestBody ProfileResponse profile, @RequestHeader("Authorization") String token);
}
