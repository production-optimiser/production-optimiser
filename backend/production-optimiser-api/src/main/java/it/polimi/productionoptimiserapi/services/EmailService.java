package it.polimi.productionoptimiserapi.services;

public interface EmailService {
  void sendEmail(String receiverMail, String subject, String body);

  void sendHtmlEmail(String receiverMail, String subject, String body);
}
