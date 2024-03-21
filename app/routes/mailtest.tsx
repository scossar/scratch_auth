import { transporter } from "~/services/mailer";

export const loader = async () => {
  transporter.sendMail(
    {
      from: "simon@example.com",
      to: "scossar@example.com",
      subject: "Test Email",
      text: "Hello World?",
      html: "<b>Hello world?</b>",
    },
    (error, info) => {
      if (error) {
        console.log(`email error: ${error}`);
      }
      console.log(`Message sent: ${info.messageId}`);
    }
  );

  return null;
};
