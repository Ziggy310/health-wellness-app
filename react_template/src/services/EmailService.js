import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.appUrl = process.env.VITE_APP_URL || 'http://localhost:3000';
    this.supportEmail = process.env.VITE_SUPPORT_EMAIL || 'support@menoplus.com';
    this.fromEmail = process.env.VITE_FROM_EMAIL || 'noreply@menoplus.com';
    
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Configure SMTP transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
        port: process.env.VITE_SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.VITE_SMTP_USER,
          pass: process.env.VITE_SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      this.isConfigured = !!(process.env.VITE_SMTP_USER && process.env.VITE_SMTP_PASS);
      
      if (this.isConfigured) {
        console.log('✅ Email service configured successfully');
      } else {
        console.warn('⚠️ Email service not configured - missing SMTP credentials');
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = '') {
    if (!this.isConfigured) {
      console.warn('Email not sent - service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: `"Meno+" <${this.fromEmail}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.htmlToText(htmlContent),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  // Authentication & Verification Emails
  async sendEmailVerification(userEmail, userName, verificationToken) {
    const verificationUrl = `${this.appUrl}/verify-email?token=${verificationToken}`;
    const subject = 'Verify your Meno+ account';
    
    const html = this.getEmailVerificationTemplate({
      userName,
      verificationUrl,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Welcome to Meno+ - Your wellness journey begins!';
    
    const html = this.getWelcomeTemplate({
      userName,
      dashboardUrl: `${this.appUrl}/dashboard`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordReset(userEmail, userName, resetToken) {
    const resetUrl = `${this.appUrl}/reset-password?token=${resetToken}`;
    const subject = 'Reset your Meno+ password';
    
    const html = this.getPasswordResetTemplate({
      userName,
      resetUrl,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordChanged(userEmail, userName) {
    const subject = 'Your Meno+ password has been changed';
    
    const html = this.getPasswordChangedTemplate({
      userName,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  // Subscription & Billing Emails
  async sendTrialStarted(userEmail, userName, trialEndDate) {
    const subject = 'Welcome to your 7-day free trial!';
    
    const html = this.getTrialStartedTemplate({
      userName,
      trialEndDate,
      dashboardUrl: `${this.appUrl}/dashboard`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendTrialEnding(userEmail, userName, daysLeft) {
    const subject = `Your Meno+ trial ends in ${daysLeft} days`;
    
    const html = this.getTrialEndingTemplate({
      userName,
      daysLeft,
      upgradeUrl: `${this.appUrl}/subscription`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPaymentSuccessful(userEmail, userName, planName, amount, nextBillingDate) {
    const subject = 'Payment successful - Thank you!';
    
    const html = this.getPaymentSuccessfulTemplate({
      userName,
      planName,
      amount,
      nextBillingDate,
      accountUrl: `${this.appUrl}/account`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPaymentFailed(userEmail, userName, planName, amount) {
    const subject = 'Payment failed - Please update your payment method';
    
    const html = this.getPaymentFailedTemplate({
      userName,
      planName,
      amount,
      updatePaymentUrl: `${this.appUrl}/account/billing`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  // Health & Wellness Emails
  async sendOnboardingComplete(userEmail, userName) {
    const subject = 'Congratulations! Your health profile is complete';
    
    const html = this.getOnboardingCompleteTemplate({
      userName,
      dashboardUrl: `${this.appUrl}/dashboard`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendWeeklyHealthSummary(userEmail, userName, summaryData) {
    const subject = 'Your weekly health summary';
    
    const html = this.getWeeklyHealthSummaryTemplate({
      userName,
      summaryData,
      dashboardUrl: `${this.appUrl}/dashboard`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendNewMealPlan(userEmail, userName, mealPlanName) {
    const subject = 'Your personalized meal plan is ready!';
    
    const html = this.getNewMealPlanTemplate({
      userName,
      mealPlanName,
      mealPlanUrl: `${this.appUrl}/meal-plans`,
      supportEmail: this.supportEmail
    });

    return await this.sendEmail(userEmail, subject, html);
  }

  // Template Methods - will be implemented in separate template files
  getEmailVerificationTemplate(data) {
    return require('../templates/emails/email-verification.js').template(data);
  }

  getWelcomeTemplate(data) {
    return require('../templates/emails/welcome.js').template(data);
  }

  getPasswordResetTemplate(data) {
    return require('../templates/emails/password-reset.js').template(data);
  }

  getPasswordChangedTemplate(data) {
    return require('../templates/emails/password-changed.js').template(data);
  }

  getTrialStartedTemplate(data) {
    return require('../templates/emails/trial-started.js').template(data);
  }

  getTrialEndingTemplate(data) {
    return require('../templates/emails/trial-ending.js').template(data);
  }

  getPaymentSuccessfulTemplate(data) {
    return require('../templates/emails/payment-successful.js').template(data);
  }

  getPaymentFailedTemplate(data) {
    return require('../templates/emails/payment-failed.js').template(data);
  }

  getOnboardingCompleteTemplate(data) {
    return require('../templates/emails/onboarding-complete.js').template(data);
  }

  getWeeklyHealthSummaryTemplate(data) {
    return require('../templates/emails/weekly-health-summary.js').template(data);
  }

  getNewMealPlanTemplate(data) {
    return require('../templates/emails/new-meal-plan.js').template(data);
  }
}

// Export singleton instance
export default new EmailService();