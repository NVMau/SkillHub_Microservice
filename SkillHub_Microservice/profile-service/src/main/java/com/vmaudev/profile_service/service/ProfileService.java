package com.vmaudev.profile_service.service;

import com.vmaudev.profile_service.configuration.S3Service;
import com.vmaudev.profile_service.dto.ProfileRegister;
import com.vmaudev.profile_service.dto.identity.Credential;
import com.vmaudev.profile_service.dto.identity.TokenExchangeParam;
import com.vmaudev.profile_service.dto.identity.UserCreationParam;
import com.vmaudev.profile_service.dto.response.CourseResponse;
import com.vmaudev.profile_service.dto.response.EnrollmentResponse;
import com.vmaudev.profile_service.dto.response.ProfileResponse;
import com.vmaudev.profile_service.event.ProfileCreatedEvent;
import com.vmaudev.profile_service.event.ProfileDeleteEvent;
import com.vmaudev.profile_service.model.Profile;
import com.vmaudev.profile_service.repository.CourseClient;
import com.vmaudev.profile_service.repository.EnrollmentClient;
import com.vmaudev.profile_service.repository.IndentityClient;
import com.vmaudev.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProfileService {

    private final IndentityClient indentityClient;
    private final ProfileRepository profileRepository;
    private final EnrollmentClient enrollmentClient;
    private final CourseClient courseClient;
    private final KafkaTemplate<String, ProfileCreatedEvent> kafkaTemplate;
    private final KafkaTemplate<String, ProfileDeleteEvent> kafkaTemplateDelete;
    private final S3Service s3Service;

    @Value("${idb.client_id}")
    String clientId;

    @Value("${idb.client_secret}")
    String clientSecret;

    public Profile createProfile(ProfileRegister profileRegister) {
        // Exchange Client Token is required
        var token = indentityClient.exchangeToken(TokenExchangeParam.builder()
                .grant_type("client_credentials")
                .client_id(clientId)
                .client_secret(clientSecret)
                .scope("openid")
                .build());
        log.info("TokenInfo{}", token);

        // Create account for Keycloak
        var createResponse = indentityClient.createUser(
                "Bearer " + token.getAccessToken(),
                UserCreationParam.builder()
                        .username(profileRegister.getUsername())
                        .firstName(profileRegister.getFirstName())
                        .lastName(profileRegister.getLastName())
                        .email(profileRegister.getEmail())
                        .enabled(true)
                        .emailVerified(false)
                        .credentials(List.of(Credential.builder()
                                .type("password")
                                .temporary(false)
                                .value(profileRegister.getPassword())
                                .build()))
                        .build());

        // Get UserID of Keycloak account
        String userId = extractUserId(createResponse);
        log.info("UserId {}", userId);

        // Gán roles cho user trong Keycloak
        assignRolesToUser(userId, profileRegister.getRoles(), token.getAccessToken());

        // Tạo đối tượng Profile mới và lưu vào database MongoDB
        Profile profile = new Profile();
        BeanUtils.copyProperties(profileRegister, profile);
        profile.setUserId(userId);
        profile.setRoles(profileRegister.getRoles());
        //Gửi bất đồng bộ đến notification-service
        ProfileCreatedEvent profileCreatedEvent = new ProfileCreatedEvent();
        profileCreatedEvent.setEmail(profile.getEmail());
        profileCreatedEvent.setFirstName(profile.getEmail());
        profileCreatedEvent.setLastName(profile.getEmail());
        log.info("Start -Sending ProfileCreatedEvent {} to Kafka topic user-created ",profileCreatedEvent);
        kafkaTemplate.send("user-created", profileCreatedEvent);
        log.info("End -Sending ProfileCreatedEvent {} to Kafka topic user-created ",profileCreatedEvent);
        // Lưu vai trò vào MongoDB
        return profileRepository.save(profile);
    }


    private void assignRolesToUser(String userId, List<String> roles, String token) {
        List<Map<String, Object>> roleMappings = roles.stream()
                .map(role -> {
                    Map<String, Object> roleInfo = indentityClient.getRoleByName("Bearer " + token, role);
                    return Map.of(
                            "name", role,
                            "id", roleInfo.get("id")
                    );
                }).collect(Collectors.toList());

        indentityClient.assignRolesToUser("Bearer " + token, userId, roleMappings);
    }



    private String extractUserId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").get(0);
        String[] splitedStr = location.split("/");
        return splitedStr[splitedStr.length - 1];
    }

    public Profile getMyProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // Lấy userID từ Keycloak
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profile;  // Profile sẽ chứa cả thông tin vai trò của người dùng
    }

    public List<CourseResponse> getCoursesByStudentId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = "";
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            token = "Bearer " + jwtAuth.getToken().getTokenValue();
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }
        String userId = authentication.getName();
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));



        List<EnrollmentResponse> enrollments = enrollmentClient.getEnrollmentsByStudentId(profile.getProfileId(), token);

        final String finalToken = token;
        List<CourseResponse> courses = enrollments.stream()
                .map(enrollment -> courseClient.getCourseById(enrollment.getCourseId(), finalToken))
                .collect(Collectors.toList());

        return courses;
    }

    public List<CourseResponse> getCoursesByTeacherId() {

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = "";
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            token = "Bearer " + jwtAuth.getToken().getTokenValue();
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }
        String userId = authentication.getName();
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        List<CourseResponse> courses = courseClient.getCoursesByTeacherId(profile.getProfileId(), token);

        return courses;
    }

    // Lấy danh sách học sinh
    public List<Profile> getAllStudents() {
        return profileRepository.findByRoles("ROLE_STUDENT");
    }

    // Lấy danh sách giáo viên
    public List<Profile> getAllTeachers() {
        return profileRepository.findByRoles("ROLE_TEACHER");
    }

    //Tim  User by id
    public Profile getUserById(String profileId) {
        log.info("Searching for user with profileId: {}", profileId); // Log thông tin profileId
        return profileRepository.findByProfileId(profileId)  // Tìm kiếm bằng profileId
                .orElseThrow(() -> new RuntimeException("User not found with profileId: " + profileId));
    }
    public List<Profile> searchUsersByName(String name) {
        return profileRepository.findByName(name);
    }
    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile); // Cập nhật số tiền đã nạp vào MongoDB
    }


    public List<Profile> getAllProfile() {
        return profileRepository.findAll();
    }
    public Profile updateUserProfile(String profileId, Profile updatedProfile) {
        Profile existingProfile = profileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User not found with userId: " + profileId));

        // Cập nhật thông tin profile dựa trên các giá trị mới được truyền vào
        existingProfile.setEmail(updatedProfile.getEmail());
        existingProfile.setFirstName(updatedProfile.getFirstName());
        existingProfile.setLastName(updatedProfile.getLastName());
        existingProfile.setDob(updatedProfile.getDob());
        existingProfile.setCoin(updatedProfile.getCoin());
        // Thêm các trường khác nếu cần

        return profileRepository.save(existingProfile);
    }


    public void deleteUserFromKeycloak(String userId) {
        // URL để gọi API xóa người dùng từ Keycloak
        String url = "http://localhost:8180/admin/realms/vmaudev/users/" + userId; // Thay {realm-name} bằng tên realm của bạn

        // Lấy token từ client credentials
        var token = indentityClient.exchangeToken(TokenExchangeParam.builder()
                .grant_type("client_credentials")
                .client_id(clientId)
                .client_secret(clientSecret)
                .scope("openid")
                .build());

        // Thiết lập header với token đã lấy được
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token.getAccessToken());

        // Tạo request với header
        HttpEntity<String> request = new HttpEntity<>(headers);

        // Sử dụng RestTemplate để gọi API
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
            log.info("User với ID {} đã được xóa thành công trên Keycloak", userId);
        } catch (HttpClientErrorException ex) {
            log.error("Lỗi khi xóa người dùng trên Keycloak: {}", ex.getMessage());
            throw new RuntimeException("Xóa người dùng trên Keycloak thất bại", ex);
        }
    }

    private ProfileResponse mapToProfileResponse(Profile profile) {
        return ProfileResponse.builder()
                .profileId(profile.getProfileId())
                .userId(profile.getUserId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .coin(profile.getCoin())
                .dob(profile.getDob())
                .lastName(profile.getLastName())
                .avatarUrl(profile.getAvatarUrl())
                .username(profile.getUsername())
                .build();
    }


    public void deleteUserFromSystem(String profileId) {
        Profile existingProfile = profileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User not found with userId: " + profileId));
        // Xóa user từ Keycloak
        deleteUserFromKeycloak(existingProfile.getUserId());

        // Gửi sự kiện xóa user lên Kafka
        ProfileDeleteEvent profileDeleteEvent = new ProfileDeleteEvent(profileId);
        profileDeleteEvent.setProfileId(profileId);
        log.info("Start -Sending ProfileDeleteEvent {} to Kafka topic user-deleted ",profileDeleteEvent);
        kafkaTemplateDelete.send("user-deleted", profileDeleteEvent);
        log.info("End -Sending ProfileDeleteEvent {} to Kafka topic user-deleted",profileDeleteEvent);

        // Xóa dữ liệu từ MongoDB
        profileRepository.deleteByProfileId(profileId);
        log.info("Profile with profileId {} has been deleted from MongoDB", profileId);
    }

    public Map<String, Long> getUserCountByRoles() {
        long adminCount = profileRepository.countByRoles("ROLE_ADMIN");
        long studentCount = profileRepository.countByRoles("ROLE_STUDENT");
        long teacherCount = profileRepository.countByRoles("ROLE_TEACHER");

        Map<String, Long> userCounts = new HashMap<>();
        userCounts.put("ROLE_ADMIN", adminCount);
        userCounts.put("ROLE_STUDENT", studentCount);
        userCounts.put("ROLE_TEACHER", teacherCount);

        return userCounts;
    }

    public String updateAvatar(String profileId, MultipartFile avatarFile) throws IOException {
        Profile profile = profileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User not found with profileId: " + profileId));

        // Tải file avatar lên S3
        String avatarUrl = s3Service.uploadFile(avatarFile);

        // Cập nhật URL avatar trong profile
        profile.setAvatarUrl(avatarUrl);
        profileRepository.save(profile);

        return avatarUrl;  // Trả về URL của ảnh avatar mới
    }

    public ProfileResponse getUserForRigistById(String profileId) {
        log.info("Tìm user cho đăng kí {}", profileId);
        return profileRepository.findByProfileId(profileId)
                .map(this::mapToProfileResponse)
                .orElse(null);

    }
}
