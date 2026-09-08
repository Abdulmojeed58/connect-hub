import { resend } from '../lib/email.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

const FROM = env.RESEND_FROM_EMAIL;
const APP_NAME = 'ConnectHub';

// ─── Helpers ────────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background:#0D51B2;padding:24px 32px;">
                  <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">${APP_NAME}</span>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:16px 32px 24px;border-top:1px solid #e4e4e7;">
                  <p style="margin:0;font-size:12px;color:#71717a;">
                    You're receiving this email because you have an account on ${APP_NAME}.<br/>
                    If you didn't expect this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#09090b;">${text}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">${text}</p>`;
}

function highlight(text: string) {
  return `<strong style="color:#0D51B2;">${text}</strong>`;
}

// Fire and forget — email failures must never break the main request flow
function send(payload: Parameters<NonNullable<typeof resend>['emails']['send']>[0]) {
  if (!resend) {
    logger.warn({ subject: payload.subject }, 'Email skipped: RESEND_API_KEY not configured');
    return;
  }
  resend.emails.send(payload).catch((err) => {
    logger.error({ err, to: payload.to, subject: payload.subject }, 'Failed to send email');
  });
}

// ─── Email templates ─────────────────────────────────────────────────────────

export const emailService = {
  sendWelcome(to: string, fullName: string) {
    send({
      from: FROM,
      to,
      subject: `Welcome to ${APP_NAME}!`,
      html: baseTemplate(`
        ${heading(`Welcome, ${fullName}! 🎉`)}
        ${paragraph(`Your account has been created. You're now part of the ${highlight(APP_NAME)} community.`)}
        ${paragraph('Start building your professional network by completing your profile and connecting with people in your field.')}
        ${paragraph('Happy networking!')}
      `),
    });
  },

  sendLoginAlert(to: string, fullName: string) {
    const time = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    send({
      from: FROM,
      to,
      subject: `New sign-in to your ${APP_NAME} account`,
      html: baseTemplate(`
        ${heading('New sign-in detected')}
        ${paragraph(`Hi ${fullName}, we noticed a new sign-in to your ${highlight(APP_NAME)} account.`)}
        ${paragraph(`<strong>Time:</strong> ${time}`)}
        ${paragraph("If this was you, no action is needed. If you don't recognise this activity, please change your password immediately.")}
      `),
    });
  },

  sendConnectionRequest(to: string, requesterName: string) {
    send({
      from: FROM,
      to,
      subject: `${requesterName} wants to connect with you on ${APP_NAME}`,
      html: baseTemplate(`
        ${heading('New connection request')}
        ${paragraph(`${highlight(requesterName)} sent you a connection request on ${APP_NAME}.`)}
        ${paragraph('Log in to your account to accept or decline the request.')}
      `),
    });
  },

  sendConnectionAccepted(to: string, acceptorName: string) {
    send({
      from: FROM,
      to,
      subject: `${acceptorName} accepted your connection request`,
      html: baseTemplate(`
        ${heading('Connection accepted! 🤝')}
        ${paragraph(`Great news — ${highlight(acceptorName)} accepted your connection request on ${APP_NAME}.`)}
        ${paragraph('You are now connected. Visit their profile to start a conversation.')}
      `),
    });
  },

  sendPasswordResetLink(to: string, fullName: string, resetUrl: string) {
    send({
      from: FROM,
      to,
      subject: `Reset your ${APP_NAME} password`,
      html: baseTemplate(`
        ${heading('Reset your password')}
        ${paragraph(`Hi ${fullName}, we received a request to reset your ${highlight(APP_NAME)} password.`)}
        ${paragraph('Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.')}
        <div style="margin:0 0 16px;text-align:center;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#0D51B2;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:6px;">
            Reset password
          </a>
        </div>
        ${paragraph('If the button doesn\'t work, copy and paste this link into your browser:')}
        <p style="margin:0 0 16px;font-size:13px;color:#71717a;word-break:break-all;">${resetUrl}</p>
        ${paragraph('If you didn\'t request a password reset, you can safely ignore this email — your password will not change.')}
      `),
    });
  },

  sendPasswordChanged(to: string, fullName: string) {
    const time = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    send({
      from: FROM,
      to,
      subject: `Your ${APP_NAME} password was changed`,
      html: baseTemplate(`
        ${heading('Password changed')}
        ${paragraph(`Hi ${fullName}, your ${highlight(APP_NAME)} password was successfully changed.`)}
        ${paragraph(`<strong>Time:</strong> ${time}`)}
        ${paragraph("If you didn't make this change, please contact support immediately and reset your password.")}
      `),
    });
  },

  sendConnectionDeclined(to: string, declinerName: string) {
    send({
      from: FROM,
      to,
      subject: `Your connection request on ${APP_NAME}`,
      html: baseTemplate(`
        ${heading('Connection request update')}
        ${paragraph(`${highlight(declinerName)} has reviewed your connection request on ${APP_NAME}.`)}
        ${paragraph('Unfortunately, they chose not to connect at this time. You can continue growing your network by reaching out to other professionals.')}
      `),
    });
  },
};
