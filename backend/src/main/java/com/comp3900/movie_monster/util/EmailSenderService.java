package com.comp3900.movie_monster.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Component
public class EmailSenderService {
    private final JavaMailSender mailSender;

    @Autowired
    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply.movie.monster@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("Email sent!");
    }

    public void sendEmailWithHyperLink(String to, String subject, String text, String url) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        message.setRecipients(Message.RecipientType.TO,InternetAddress.parse(to));
        String link = String.format("%s<a href=\"%s\">\"%s\"</a>",
                text, url, url);
        message.setText(link, "UTF-8", "html");
        message.setSubject(subject);
//        message.setSender(InternetAddress.parse("noreply.movie.monster@gmail.com"));
        mailSender.send(message);
        System.out.println("Email sent!");
    }
}
