package com.vmaudev.profile_service.controller;

import java.math.BigDecimal;
import java.util.List;

import com.vmaudev.profile_service.model.Profile;
import com.vmaudev.profile_service.service.ProfileService;
import com.vmaudev.profile_service.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.logging.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.Authentication;





@Controller
@RequestMapping("/api/profiles")
public class VNPayController {

    private static final Logger logger = Logger.getLogger(VNPayController.class.getName());

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private ProfileService profileService;
    //
    @PostMapping("/submitOrder")
    public ResponseEntity<String> submitOrder(@RequestParam("amount") int orderTotal, @RequestParam("profileId") String profileId, HttpServletRequest request) {



        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() ;
        String vnpayUrl = vnPayService.createOrder(orderTotal, profileId, baseUrl); // truyền username dưới dạng orderInfo
        return new ResponseEntity<>(vnpayUrl, HttpStatus.OK);
    }

    @GetMapping("/vnpay-payment")
    public String vnpayReturn(HttpServletRequest request, Model model) {


        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo"); // lấy username từ orderInfo
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        logger.info("Payment Status: " + paymentStatus);
        logger.info("profileId: " + orderInfo); // Log username lấy từ orderInfo
        logger.info("Total Price: " + totalPrice);

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        if (paymentStatus == 1) {
            Profile profile = profileService.getUserById(orderInfo); // Sử dụng username từ orderInfo
            if (profile != null) {
                BigDecimal totalAmount = new BigDecimal(totalPrice).divide(new BigDecimal(1000)); // VNPay trả về số tiền nhân với 100
                BigDecimal coins = totalAmount.divide(new BigDecimal(100)); // Giả sử 1 coin = 1000 VND
                BigDecimal currentCoin = profile.getCoin() != null ? profile.getCoin() : BigDecimal.ZERO;
                profile.setCoin(currentCoin.add(coins)); // Cộng tiền vào tài khoản/ Cộng thêm số coin vào tài khoản user
                profileService.updateProfile(profile); // Cập nhật profile trong database
                logger.info(" Chạy đến đây: " + profile.getCoin());
            } else {
                logger.warning("Profile not found for profileId: " + orderInfo);
            }
        }

        return "redirect:http://localhost:3000"; // Chuyển hướng người dùng tới trang chủ
    }
}