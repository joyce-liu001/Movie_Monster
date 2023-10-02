package com.comp3900.movie_monster.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;

@RestController
public class EmailController {
    private final EmailSenderService emailSenderService;

    @Autowired
    public EmailController(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    public void sendEmail(String to, String subject, String body) {
        emailSenderService.sendEmail(to, subject, body);
    }

    public void sendEmailWithHyperLink(String to, String subject, String text, String url) throws MessagingException {
        emailSenderService.sendEmailWithHyperLink(to, subject, text, url);
    }
}
