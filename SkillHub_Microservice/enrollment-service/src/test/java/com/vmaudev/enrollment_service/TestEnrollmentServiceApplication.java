package com.vmaudev.enrollment_service;

import org.springframework.boot.SpringApplication;

public class TestEnrollmentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(EnrollmentServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
