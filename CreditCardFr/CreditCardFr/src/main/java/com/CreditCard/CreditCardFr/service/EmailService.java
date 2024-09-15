package com.CreditCard.CreditCardFr.service;

import com.sendgrid.*;
    import com.sendgrid.helpers.mail.Mail;
    import com.sendgrid.helpers.mail.objects.Content;
    import com.sendgrid.helpers.mail.objects.Email;
    import org.springframework.stereotype.Service;

    import java.io.IOException;

    @Service
    public class EmailService {

        private static final String SENDGRID_API_KEY = "your-sendgrid-api-key";

        public void sendSuspectTransactionEmail(Long transactionId) throws IOException {
            Email from = new Email("your-email@example.com");
            String subject = "Suspect Transaction Alert";
            Email to = new Email("moohameede06@gmail.com");
            Content content = new Content("text/plain", "The transaction with ID=" + transactionId + " is suspect. Please review and modify it.");
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(SENDGRID_API_KEY);
            Request request = new Request();
            try {
                request.setMethod(Method.POST);
                request.setEndpoint("mail/send");
                request.setBody(mail.build());
                sg.api(request);
            } catch (IOException ex) {
                throw ex;
            }
        }
    }
