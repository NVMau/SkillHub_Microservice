package com.vmaudev.profile_service.dto.response;
import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    String profileId;
    String userId;
    String email;
    String username;
    String firstName;
    String lastName;
    String avatarUrl;
    BigDecimal coin;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate dob;
}
