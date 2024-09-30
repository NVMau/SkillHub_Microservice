package com.vmaudev.profile_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {
    @Id
    private String profileId;
    private String userId;  // Id from Keycloak
    private String email;
    private String username;
    private String firstName;

    private String lastName;
    private String avatarUrl;
    private LocalDate dob;
    private BigDecimal coin;
    private List<String> roles; // Danh sách các vai trò của người dùng  để lấy danh sách học sinh do khi lấy bằng keycloak phải cho quyền cao gây mất đi tính bảo mât
}
