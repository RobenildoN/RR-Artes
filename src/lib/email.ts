import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "noreply@rrartes.com.br";

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments,
      });

      console.log(`Email successfully sent via SMTP to ${data.to}`);
      return true;
    } catch (error) {
      console.error("Failed to send email via SMTP, falling back to local storage:", error);
    }
  }

  // Local Offline Mock Delivery
  try {
    const emailsDir = path.join(process.cwd(), "public", "emails");
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir, { recursive: true });
    }

    const emailFile = path.join(emailsDir, `email-${Date.now()}.json`);
    const savedData = {
      timestamp: new Date().toISOString(),
      from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments?.map((att) => ({
        filename: att.filename,
        originalPath: att.path,
        localUrl: att.path.includes("public")
          ? att.path.split("public")[1].replace(/\\/g, "/")
          : att.path,
      })),
    };

    fs.writeFileSync(emailFile, JSON.stringify(savedData, null, 2), "utf8");
    console.log(`[Offline Mock] Email logged to file: ${emailFile}`);
    return true;
  } catch (err) {
    console.error("Failed to write mock email file:", err);
    return false;
  }
}
