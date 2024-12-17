package com.vmaudev.profile_service.repository;


import com.vmaudev.profile_service.dto.identity.TokenExchangeParam;
import com.vmaudev.profile_service.dto.identity.TokenExchangeResponse;
import com.vmaudev.profile_service.dto.identity.UserCreationParam;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "identity-client", url= "${idb.url}")
public interface IndentityClient {
    @PostMapping(value = "/realms/vmaudev/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenExchangeResponse exchangeToken(@QueryMap TokenExchangeParam param);


    @PostMapping(value = "/admin/realms/vmaudev/users",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> createUser(
            @RequestHeader("authorization") String tokenn,
            @RequestBody UserCreationParam param);

    @GetMapping(value = "/admin/realms/vmaudev/roles/{roleName}")
    Map<String, Object> getRoleByName(@RequestHeader("authorization") String token, @PathVariable("roleName") String roleName);



    @PostMapping(value = "/admin/realms/vmaudev/users/{userId}/role-mappings/realm",
            consumes = MediaType.APPLICATION_JSON_VALUE)


    void assignRolesToUser(@RequestHeader("authorization") String token,
                           @PathVariable("userId") String userId,
                           @RequestBody List<Map<String, Object>> roles);


    @GetMapping(value = "/admin/realms/vmaudev/roles/{roleName}/users")
    List<Map<String, Object>> getUsersByRole(@RequestHeader("authorization") String token, @PathVariable("roleName") String roleName);
}
