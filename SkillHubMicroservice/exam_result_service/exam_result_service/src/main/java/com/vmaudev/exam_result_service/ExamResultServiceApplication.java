package com.vmaudev.exam_result_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ExamResultServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExamResultServiceApplication.class, args);
	}

}
