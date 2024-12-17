package com.vmaudev.course_service;

import org.springframework.boot.SpringApplication;

public class TestCourseServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(CourseServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
