package com.vmaudev.profile_service.controller;

import com.vmaudev.profile_service.dto.ProfileRegister;
import com.vmaudev.profile_service.dto.response.CourseResponse;
import com.vmaudev.profile_service.dto.response.ProfileResponse;
import com.vmaudev.profile_service.model.Profile;
import com.vmaudev.profile_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<Profile> registerProfile(@RequestBody ProfileRegister profileRegister) {
        Profile createdProfile = profileService.createProfile(profileRegister);
        return ResponseEntity.ok(createdProfile);
    }


    @GetMapping("/all-profiles")
    public ResponseEntity<List<Profile>> getAllProfile() {
        List<Profile> profiles = profileService.getAllProfile();
        return ResponseEntity.ok(profiles);
    }



    @GetMapping("/my-profile")
    public ResponseEntity<Profile> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();



        Profile profile = profileService.getMyProfile();
        return ResponseEntity.ok(profile);

    }

    @GetMapping("/courses")
    public List<CourseResponse> getCoursesByStudentId() {
        return profileService.getCoursesByStudentId();
    }

    @GetMapping("/teacher-courses")
    public List<CourseResponse> getCoursesByTeacherId() {
        return profileService.getCoursesByTeacherId();
    }
//
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
//    @GetMapping("/admin-only")
//    public ResponseEntity<String> adminOnlyEndpoint() {
//        return ResponseEntity.ok("Only admins can access this endpoint");
//    }
//
//    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT')")
//    @GetMapping("/student-only")
//    public ResponseEntity<String> studentOnlyEndpoint() {
//        return ResponseEntity.ok("Only students can access this endpoint");
//    }
//
//    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
//    @GetMapping("/teacher-only")
//    public ResponseEntity<String> teacherOnlyEndpoint() {
//        return ResponseEntity.ok("Only teachers can access this endpoint");
//    }


    // API để lấy danh sách học sinh
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")


    @GetMapping("/students")
    public ResponseEntity<List<Profile>> getAllStudents() {
        List<Profile> students = profileService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // API để lấy danh sách giáo viên
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/teachers")
    public ResponseEntity<List<Profile>> getAllTeachers() {
        List<Profile> teachers = profileService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Profile> getUserById(@PathVariable String userId) {
        Profile profile = profileService.getUserById(userId);
        return ResponseEntity.ok(profile);
    }
    @GetMapping("/user/register-course/{userId}")
    public ResponseEntity<ProfileResponse> getUserForRigistById(@PathVariable String userId) {
        ProfileResponse profile = profileService.getUserForRigistById(userId);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Trả về 404 nếu không tìm thấy
        }
        return ResponseEntity.ok(profile);
    }


    @GetMapping("/search")
    public ResponseEntity<List<Profile>> searchUsersByName(@RequestParam String name) {
        List<Profile> profiles = profileService.searchUsersByName(name);
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/user/{profileId}")
    public ResponseEntity<Profile> updateUser(@PathVariable String profileId, @RequestBody Profile updatedProfile) {
        Profile updated = profileService.updateUserProfile(profileId, updatedProfile);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/delete-user/{profileId}")
    public ResponseEntity<String> deleteUser(@PathVariable String profileId) {
        try {
            profileService.deleteUserFromSystem(profileId);
            return ResponseEntity.ok("Xóa người dùng thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa người dùng thất bại: " + e.getMessage());
        }
    }
    @GetMapping("/user-count")
    public ResponseEntity<Map<String, Long>> getUserCountByRoles() {
        Map<String, Long> userCounts = profileService.getUserCountByRoles();
        return ResponseEntity.ok(userCounts);
    }


    @PutMapping("/update-avatar/{profileId}")
    public ResponseEntity<String> updateAvatar(
            @PathVariable String profileId,
            @RequestPart("avatar") MultipartFile avatarFile) {
        try {
            String avatarUrl = profileService.updateAvatar(profileId, avatarFile);
            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật avatar: " + e.getMessage());
        }
    }

}
