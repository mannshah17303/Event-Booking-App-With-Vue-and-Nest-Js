/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import nodemailer from 'nodemailer';

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'projectmanagement760@gmail.com',
        pass: 'vkpq qkmo mhvk ovzb',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: 'projectmanagement760@gmail.com',
      to,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export const mailService = new MailService();
