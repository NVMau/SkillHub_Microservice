package com.vmaudev.profile_service.controller;

import com.vmaudev.profile_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;



import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/api/test")
@RequiredArgsConstructor
@RestController
public class TestController {

    private final ProfileService profileService;

    // API để test xóa user từ Keycloak
    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        try {
            profileService.deleteUserFromKeycloak(userId);
            return ResponseEntity.ok("Xóa user thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa user thất bại: " + e.getMessage());
        }
    }
}
