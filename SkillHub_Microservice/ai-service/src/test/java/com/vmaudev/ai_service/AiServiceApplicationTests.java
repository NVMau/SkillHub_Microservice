package com.vmaudev.ai_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class AiServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
