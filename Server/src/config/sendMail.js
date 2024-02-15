import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../utlis/validateEnv.js";

const sendEmail = async ({ from, to, subject, text, userName }) => {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Pinshot",
      link: "http://mailgen..js",
    },
  });
  var email = {
    body: {
      name: userName,
      intro: text || "Welcome to Pinshot",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email);

  try {
    let mailOptions = {
      from,
      to,
      subject,
      html: emailBody,
    };
    const transporter = nodemailer.createTransport({
      host: env.HOST,
      port: env.BREVO_PORT,
      auth: {
        user: env.USER_MAIL_LOGIN,
        pass: env.BREVO_MAIL_KEY,
      },
    });
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true, msg: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    console.log("Email not sent");
    return { success: false, msg: "Faild to send email" };
  }
};

export default sendEmail;
