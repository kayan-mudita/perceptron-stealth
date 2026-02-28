const appName = "Official AI";
const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #13131a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 16px; line-height: 36px;">&#10024;</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="color: #ffffff; font-size: 18px; font-weight: 700;">Official </span>
                    <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 18px; font-weight: 700;">AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0; color: rgba(255,255,255,0.25); font-size: 12px; line-height: 1.5; text-align: center;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.<br />
                You received this email because you have an account at ${appName}.<br />
                <a href="${appUrl}" style="color: rgba(255,255,255,0.35); text-decoration: underline;">${appUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buttonHtml(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
  <tr>
    <td style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 10px; padding: 14px 32px;">
      <a href="${url}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">${text}</a>
    </td>
  </tr>
</table>`;
}

// ──────────────────────────────────────────────
// Welcome Email
// ──────────────────────────────────────────────

export function welcomeEmailHtml(firstName: string): string {
  return baseLayout(`
    <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 24px; font-weight: 700;">Welcome to ${appName}!</h1>
    <p style="margin: 0 0 20px; color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.6;">
      Hi ${firstName}, we're excited to have you on board. Your AI-powered marketing teammate is ready to help you create professional video content in minutes.
    </p>
    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;">Here's what you can do next:</p>
    <ul style="margin: 0 0 20px; padding-left: 20px; color: rgba(255,255,255,0.5); font-size: 14px; line-height: 2;">
      <li>Upload your photo and voice sample</li>
      <li>Set up your brand profile</li>
      <li>Create your first AI video</li>
      <li>Connect your social accounts</li>
    </ul>
    ${buttonHtml("Go to Dashboard", `${appUrl}/dashboard/overview`)}
    <p style="margin: 0; color: rgba(255,255,255,0.35); font-size: 13px; line-height: 1.5;">
      Your 14-day free trial has started. No credit card required.
    </p>
  `);
}

export function welcomeEmailText(firstName: string): string {
  return `Welcome to ${appName}!

Hi ${firstName}, we're excited to have you on board. Your AI-powered marketing teammate is ready to help you create professional video content in minutes.

Here's what you can do next:
- Upload your photo and voice sample
- Set up your brand profile
- Create your first AI video
- Connect your social accounts

Go to Dashboard: ${appUrl}/dashboard/overview

Your 14-day free trial has started. No credit card required.

-- ${appName}`;
}

// ──────────────────────────────────────────────
// Password Reset Email
// ──────────────────────────────────────────────

export function passwordResetEmailHtml(firstName: string, resetToken: string): string {
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;
  return baseLayout(`
    <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 24px; font-weight: 700;">Reset your password</h1>
    <p style="margin: 0 0 20px; color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.6;">
      Hi ${firstName}, we received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.
    </p>
    ${buttonHtml("Reset Password", resetUrl)}
    <p style="margin: 0 0 12px; color: rgba(255,255,255,0.35); font-size: 13px; line-height: 1.5;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0 0 20px; word-break: break-all;">
      <a href="${resetUrl}" style="color: #3b82f6; font-size: 13px; text-decoration: underline;">${resetUrl}</a>
    </p>
    <p style="margin: 0; color: rgba(255,255,255,0.35); font-size: 13px; line-height: 1.5;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
  `);
}

export function passwordResetEmailText(firstName: string, resetToken: string): string {
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;
  return `Reset your password

Hi ${firstName}, we received a request to reset your password. Use the link below to choose a new one. This link will expire in 1 hour.

Reset your password: ${resetUrl}

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

-- ${appName}`;
}

// ──────────────────────────────────────────────
// Email Verification
// ──────────────────────────────────────────────

export function emailVerificationHtml(firstName: string, verificationToken: string): string {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`;
  return baseLayout(`
    <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 24px; font-weight: 700;">Verify your email</h1>
    <p style="margin: 0 0 20px; color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.6;">
      Hi ${firstName}, please verify your email address to complete your account setup. Click the button below to confirm your email.
    </p>
    ${buttonHtml("Verify Email Address", verifyUrl)}
    <p style="margin: 0 0 12px; color: rgba(255,255,255,0.35); font-size: 13px; line-height: 1.5;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0 0 20px; word-break: break-all;">
      <a href="${verifyUrl}" style="color: #3b82f6; font-size: 13px; text-decoration: underline;">${verifyUrl}</a>
    </p>
    <p style="margin: 0; color: rgba(255,255,255,0.35); font-size: 13px; line-height: 1.5;">
      This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `);
}

export function emailVerificationText(firstName: string, verificationToken: string): string {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`;
  return `Verify your email

Hi ${firstName}, please verify your email address to complete your account setup. Use the link below to confirm your email.

Verify your email: ${verifyUrl}

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.

-- ${appName}`;
}
