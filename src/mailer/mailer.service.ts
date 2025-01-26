import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from 'src/config/config.service';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly templatesPath = join(__dirname, 'templates');
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER') || 'user',
        pass: this.configService.get('MAIL_PASSWORD') || 'password',
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    const filePath = join(this.templatesPath, `${templateName}/mail.hbs`);
    const templateSource = readFileSync(filePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    return template(context);
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    const html = this.compileTemplate(templateName, context);
    const mailOptions = {
      from: 'noreply@jarvis.com',
      to: to,
      subject: subject,
      html: html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
