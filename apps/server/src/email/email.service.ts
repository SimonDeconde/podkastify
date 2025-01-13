import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '@server/auth/auth.service';
import { ConfigService } from '@server/config/config.service';
import { getMagicLink } from '@server/utils';
import { RoutePath } from '@shared/route-path';

@Injectable()
export class EmailService {
  protected serviceUrl = this.configService.get('WEB_HOST');

  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    private authService: AuthService,
  ) {}

  async sendMail(sendMailOptions: ISendMailOptions) {
    const nodeEnv = this.configService.get('NODE_ENV');
    const emailEnabled = Boolean(
      this.configService.get('EMAILS_ENABLED') === 'true',
    );

    if (nodeEnv !== 'production') {
      sendMailOptions['subject'] =
        `[${nodeEnv}] - ${sendMailOptions['subject']}`;
    }

    if (emailEnabled) {
      await this.mailerService.sendMail(sendMailOptions);
    } else {
      console.log(
        `Email blocked: ${sendMailOptions['subject']} to ${sendMailOptions['to']}`,
      );
    }
  }

  async sendUserWelcome(user: User, token: string) {
    const confirmationUrl = `${this.configService.get('WEB_HOST')}/verify-email?token=${token}`;
    await this.sendMail({
      to: user.email,
      subject: `Welcome to ${this.configService.get('SERVICE_NAME')}! Confirm your Email`,
      template: './welcome',
      context: {
        firstName: user.firstName,
        confirmationUrl,
      },
    });
  }

  async sendResetPassword(user: User, password: string) {
    const confirmationUrl = `${this.configService.get('WEB_HOST')}/login`;
    await this.sendMail({
      to: user.email,
      subject: 'Password has been reset',
      template: './reset-password',
      context: {
        firstName: user.firstName,
        confirmationUrl,
        password,
      },
    });
  }

  async sendMagicLoginLink(user: User) {
    // Short expiry for magic login link.
    const jwt = this.authService.getJwt(
      user,
      this.configService.get('MAGIC_LOGIN_LINK_EXPIRES_IN'),
    );

    const magicLoginLink =
      this.serviceUrl + getMagicLink(jwt, RoutePath.DASHBOARD);

    await this.sendMail({
      to: user.email,
      subject: `Your ${this.configService.get('SERVICE_NAME')} Magic Login Link`,
      template: './magic-login-link',
      context: {
        serviceName: this.configService.get('SERVICE_NAME'),
        firstName: user.firstName,
        magicLoginLink,
        expiresIn: jwt.expiresIn,
      },
    });
  }
}
