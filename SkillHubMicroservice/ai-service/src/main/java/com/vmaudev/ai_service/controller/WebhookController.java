package com.vmaudev.ai_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/webhook")
public class WebhookController {

    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = ""; // Thay thế bằng OpenAI API key của bạn

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody JsonNode request) throws Exception {
        String intentName = request.get("queryResult").get("intent").get("displayName").asText();
        String responseText = "Default response";
        logger.info("Received intent: " + intentName);

        if ("Default Fallback Intent".equals(intentName)) {
            // Gọi API của OpenAI GPT-4
            String userQuery = request.get("queryResult").get("queryText").asText();
            logger.info("User query: " + userQuery);
            responseText = callOpenAIGPT4API(userQuery);
            logger.info("Response from OpenAI: " + responseText);
        }

        // Tạo phản hồi cho Dialogflow với định dạng mong muốn
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode responseNode = mapper.createObjectNode();
        ArrayNode fulfillmentMessagesArray = mapper.createArrayNode();

        ObjectNode textObject = mapper.createObjectNode();
        ArrayNode textArray = mapper.createArrayNode();
        textArray.add(responseText);
        textObject.set("text", textArray);

        ObjectNode messageObject = mapper.createObjectNode();
        messageObject.set("text", textObject);
        fulfillmentMessagesArray.add(messageObject);

        responseNode.set("fulfillmentMessages", fulfillmentMessagesArray);

        String responseString = mapper.writeValueAsString(responseNode);
        logger.info("Response to Dialogflow: " + responseString);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(responseString);
    }

    private String callOpenAIGPT4API(String text) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode requestBody = mapper.createObjectNode();
        requestBody.put("model", "gpt-4");

        // Tạo mảng messages để gửi đến API GPT-4
        ArrayNode messages = mapper.createArrayNode();
        ObjectNode userMessage = mapper.createObjectNode();
        userMessage.put("role", "user");
        userMessage.put("content", text);
        messages.add(userMessage);

        requestBody.set("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(OPENAI_API_URL, entity, JsonNode.class);
            JsonNode choices = response.getBody().get("choices");
            String responseText = choices.get(0).get("message").get("content").asText();

            // Loại bỏ câu hỏi gốc khỏi phản hồi
            String cleanedResponse = responseText.replaceFirst("(?i)" + text, "").trim();
            return cleanedResponse.isEmpty() ? "Default response" : cleanedResponse;
        } catch (HttpServerErrorException e) {
            // Xử lý lỗi khi mô hình đang tải hoặc có lỗi khác
            logger.error("Error calling OpenAI API: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }
}