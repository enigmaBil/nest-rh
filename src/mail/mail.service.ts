import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  async sendAccountCreationEmail(email: string, name: string, resetToken: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reinitialisation de votre mot de passe',
      template: 'reset-password',
      context: {
        name,
        resetLink: `${this.configService.get('FRONTEND_URL')}/auth/reset-password/${resetToken}`,
      },
    });
  }

  async sendAccountCredentialsEmail(email: string, name: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue sur RH-APP',
      template: 'account-created',
      context: {
        name,
        email,
        password,
      },
    });
  }

  async sendLeaveValidationEmail(email: string, name: string, statut: 'ACCEPTE' | 'REFUSE') {
    const statutLibelle = statut === 'ACCEPTE' ? 'acceptée' : 'refusée';
    await this.mailerService.sendMail({
      to: email,
      subject: 'Statut de votre demande de congé',
      template: 'leave-validation',
      context: {
        name,
        statut: statutLibelle,
      },
    });
  }
}