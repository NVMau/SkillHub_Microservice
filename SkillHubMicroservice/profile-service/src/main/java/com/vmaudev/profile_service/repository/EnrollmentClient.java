package com.vmaudev.profile_service.repository;
import com.vmaudev.profile_service.dto.identity.TokenExchangeParam;
import com.vmaudev.profile_service.dto.identity.TokenExchangeResponse;
import com.vmaudev.profile_service.dto.identity.UserCreationParam;
import com.vmaudev.profile_service.dto.response.EnrollmentResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "enrollment-client", url= "${erl.url}")
public interface EnrollmentClient {

    @GetMapping("/api/enrollments/student/{studentId}")
    List<EnrollmentResponse> getEnrollmentsByStudentId(@PathVariable("studentId") String studentId,@RequestHeader("Authorization") String token);



    @PostMapping(value = "/admin/realms/vmaudev/users",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> createUser(
            @RequestHeader("authorization") String tokenn,
            @RequestBody UserCreationParam param);
}


