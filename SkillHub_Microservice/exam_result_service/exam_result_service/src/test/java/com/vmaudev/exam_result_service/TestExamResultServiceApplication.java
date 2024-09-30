package com.vmaudev.exam_result_service;

import org.springframework.boot.SpringApplication;

public class TestExamResultServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ExamResultServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
