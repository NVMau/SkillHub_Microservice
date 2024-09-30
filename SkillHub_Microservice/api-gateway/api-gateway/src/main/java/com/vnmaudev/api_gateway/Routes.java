package com.vnmaudev.api_gateway;


import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {

    @Bean
    public RouterFunction<ServerResponse> courseServiceRoutes() {
        return GatewayRouterFunctions.route("course_service")
                .route(RequestPredicates.path("/api/courses/**"),
                        HandlerFunctions.http("http://localhost:8083"))
                .build();



    }

    @Bean
    public RouterFunction<ServerResponse> enrollmentServiceRoutes() {
        return GatewayRouterFunctions.route("enrollment_service")
                .route(RequestPredicates.path("/api/enrollments/**"),
                        HandlerFunctions.http("http://localhost:8081"))
                .build();





    }



    @Bean
    public RouterFunction<ServerResponse> profileServiceRoutes() {
        return GatewayRouterFunctions.route("profile_service")
                .route(RequestPredicates.path("/api/profiles/**"),
                        HandlerFunctions.http("http://localhost:8082"))
                .build();



    }

    @Bean
    public RouterFunction<ServerResponse> lectureServiceRoutes() {
        return GatewayRouterFunctions.route("lecture_service")
                .route(RequestPredicates.path("/api/lectures/**"),
                        HandlerFunctions.http("http://localhost:8084"))
                .build();



    }


    @Bean
    public RouterFunction<ServerResponse> assignmentServiceRoutes() {
        return GatewayRouterFunctions.route("assignments_service")
                .route(RequestPredicates.path("/api/assignments/**"),
                        HandlerFunctions.http("http://localhost:8085"))
                .build();



    }
    @Bean
    public RouterFunction<ServerResponse> examresultServiceRoutes() {
        return GatewayRouterFunctions.route("exam_result_service")
                .route(RequestPredicates.path("/api/exam-results/**"),
                        HandlerFunctions.http("http://localhost:8086"))
                .build();



    }

    @Bean
    public RouterFunction<ServerResponse> blogServiceRoutes() {
        return GatewayRouterFunctions.route("blog_service")
                .route(RequestPredicates.path("/api/blog/**"),
                        HandlerFunctions.http("http://localhost:8089"))
                .build();



    }
    @Bean
    public RouterFunction<ServerResponse> chatAiServiceRoutes() {
        return GatewayRouterFunctions.route("ai_service")
                .route(RequestPredicates.path("/api/chat/**"),
                        HandlerFunctions.http("http://localhost:8090"))
                .build();



    }


}
