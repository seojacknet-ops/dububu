import nodemailer from 'nodemailer';

// SMTP Configuration
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// Create reusable transporter
const transporter = smtpConfig.auth.user && smtpConfig.auth.pass
  ? nodemailer.createTransport(smtpConfig)
  : null;

// Test mode configuration
const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
const testRecipient = process.env.EMAIL_TEST_RECIPIENT;

// Email addresses
export const emailAddresses = {
  orders: process.env.SMTP_FROM_ORDERS || 'DuBuBu Orders <orders@dububu.co>',
  support: process.env.SMTP_FROM_SUPPORT || 'DuBuBu <hello@dububu.co>',
  admin: process.env.SMTP_ADMIN_EMAIL || 'hello@dububu.co',
};

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Hostinger SMTP
 * In test mode, all emails are redirected to EMAIL_TEST_RECIPIENT
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!transporter) {
    console.error('[EMAIL] SMTP not configured - missing SMTP_USER or SMTP_PASSWORD');
    return {
      success: false,
      error: 'Email service is not configured.',
    };
  }

  // Determine recipient(s)
  let recipients = Array.isArray(options.to) ? options.to : [options.to];
  
  // In test mode, redirect all emails to test recipient
  if (isTestMode) {
    if (!testRecipient) {
      console.error('[EMAIL] Test mode enabled but EMAIL_TEST_RECIPIENT not set');
      return {
        success: false,
        error: 'Test mode enabled but no test recipient configured.',
      };
    }
    console.log(`[EMAIL] Test mode: Redirecting email from [${recipients.join(', ')}] to [${testRecipient}]`);
    recipients = [testRecipient];
  }

  try {
    const info = await transporter.sendMail({
      from: options.from || emailAddresses.support,
      to: recipients.join(', '),
      replyTo: options.replyTo,
      subject: isTestMode ? `[TEST] ${options.subject}` : options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`[EMAIL] Sent successfully: ${info.messageId} to ${recipients.join(', ')}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL] Failed to send:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify SMTP connection
 * Useful for health checks or startup validation
 */
export async function verifyConnection(): Promise<boolean> {
  if (!transporter) {
    console.error('[EMAIL] Cannot verify - SMTP not configured');
    return false;
  }

  try {
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] SMTP connection verification failed:', error);
    return false;
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return transporter !== null;
}
