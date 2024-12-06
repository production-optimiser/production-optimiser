package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender mailSender;

  @Override
  public void sendEmail(String receiverMail, String subject, String body) {
    SimpleMailMessage message = new SimpleMailMessage();

    message.setTo(receiverMail);
    message.setSubject(subject);
    message.setText(body);

    mailSender.send(message);
  }

  @Override
  public void sendHtmlEmail(String receiverMail, String subject, String body) {
    try {
      String htmlContent = loadHtmlTemplate("templates/email-template.html");
      htmlContent = htmlContent.replace("{{placeholder}}", body);

      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
      helper.setTo(receiverMail);
      helper.setSubject(subject);
      helper.setText(htmlContent, true);

      mailSender.send(message);
    } catch (IOException | MessagingException e) {
      throw new RuntimeException("Failed to send email", e);
    }
  }

  private String loadHtmlTemplate(String templatePath) throws IOException {
    ClassPathResource resource = new ClassPathResource(templatePath);
    return Files.readString(resource.getFile().toPath());
  }
}
