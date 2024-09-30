package com.vmaudev.course_service;

import io.restassured.RestAssured;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.MongoDBContainer;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductServiceApplicationTests {

	@ServiceConnection
	static MongoDBContainer  mongoDBContainer= new MongoDBContainer("mongo:7.0.5");

	@LocalServerPort
	private Integer port;


	@BeforeEach
	void setUp() {

		RestAssured.baseURI = "http://localhost";
		RestAssured.port = port;
	}
	static {

		mongoDBContainer.start();


	}

	@Test
	void shouldCreateCourse() {
		String requestBody = """
				{
				  "name": "1Introduction to Spring Boot",
				  "description": "A comprehensive course on Spring Boot framework.",
				  "price": 29.99,
				  "category": "Programming",
				  "imageUrl": "http://example.com/images/spring-boot-course.jpg",
				  "tags": ["spring", "java", "backend"],
				  "teacherId": "teacher-123",
				  "lectureIds": ["lecture-1", "lecture-2"]
				}
				
				""";

		RestAssured.given().contentType("application/json")
				.body(requestBody)
				.when()
				.post("api/courses")
				.then().statusCode(201)
				.body("id", Matchers.notNullValue())
				.body("name", Matchers.equalTo("1Introduction to Spring Boot"));
	}

}
