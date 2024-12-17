package com.vmaudev.blog_service;

import org.springframework.boot.SpringApplication;

public class TestBlogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(BlogServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
