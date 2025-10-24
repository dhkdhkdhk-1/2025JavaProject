package kr.ac.ync.library.global.common.mail.service;

import kr.ac.ync.library.domain.rentals.email.service.EmailLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final EmailLogService emailLogService;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("영남이공대학교 도서관리시스템 <3160rnjs@ync.ac.kr>"); // ✅ 발신자
        mailSender.send(message);

        emailLogService.recordLog(to,subject,text);

        System.out.println("📩 메일 전송 완료: " + to);
    }
}
