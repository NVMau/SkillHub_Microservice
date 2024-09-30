package com.vmaudev.notification_service.service;

import com.vmaudev.enrollment_service.event.OrderPlacedEvent;
import com.vmaudev.profile_service.event.ProfileCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender javaMailSender;

    @KafkaListener(topics = "order-placed")
    public void listen(OrderPlacedEvent orderPlacedEvent){
        log.info("Got Message from order-placed topic {}", orderPlacedEvent);
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("springshop@email.com");
            messageHelper.setTo(orderPlacedEvent.getEmail().toString());
            messageHelper.setSubject(String.format("Ban da dang khi thanh cong khoa hoc: %s ", orderPlacedEvent.getCourseId()));
            messageHelper.setText(String.format("""
                            Hi %s,%s

                            Ban da dang khi thanh cong khoa hoc: %s
                            
                            Best Regards
                            Skill Hub Academy
                            """,
                    orderPlacedEvent.getFirstName().toString(),
                    orderPlacedEvent.getLastName().toString(),
                    orderPlacedEvent.getCourseId()));
        };
        try {
            javaMailSender.send(messagePreparator);
            log.info("Order Notifcation email sent!!");
        } catch (MailException e) {
            log.error("Exception occurred when sending mail", e);
            throw new RuntimeException("Exception occurred when sending mail to springshop@email.com", e);
        }
    }
    @KafkaListener(topics = "user-created")
    public void listen(ProfileCreatedEvent profileCreatedEvent){
        log.info("Got Message from user-created topic {}", profileCreatedEvent);
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("springshop@email.com");
            messageHelper.setTo(profileCreatedEvent.getEmail().toString());
            messageHelper.setSubject(String.format("Bạn đã đăng kí thành công tài khoản dưới tên: %s ", profileCreatedEvent.getFirstName().toString()));
            messageHelper.setText(String.format("""
                            Hi %s,%s

                            Chúc mừng bạn đã đăng kí thành công tài khoản SkillHib, chúc bạn có nhứng trả nghiệm tuyệt vời với website
                         
                            
                            Best Regards
                            Skill Hub Academy
                            """,
                    profileCreatedEvent.getFirstName().toString(),
                    profileCreatedEvent.getLastName().toString()));
        };
        try {
            javaMailSender.send(messagePreparator);
            log.info("CreateUser Notifcation email sent!!");
        } catch (MailException e) {
            log.error("Exception occurred when sending mail", e);
            throw new RuntimeException("Exception occurred when sending mail to springshop@email.com", e);
        }
    }
}
