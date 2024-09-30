package com.vmaudev.profile_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRegister {
    private String email;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private List<String> roles;
}

