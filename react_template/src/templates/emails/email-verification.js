import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, verificationUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Verify your email address</h2>
    
    <p style="margin-bottom: 20px;">
        Welcome to Meno+! We're excited to help you on your menopause wellness journey.
    </p>
    
    <p style="margin-bottom: 20px;">
        To complete your account setup and ensure you receive important updates about your health tracking, 
        please verify your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" class="button" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Verify Email Address
        </a>
    </div>
    
    <p style="margin-bottom: 20px; font-size: 14px; color: #64748b;">
        If the button doesn't work, you can copy and paste this link into your browser:
        <br>
        <a href="${verificationUrl}" style="color: #8b5cf6; word-break: break-all;">${verificationUrl}</a>
    </p>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">💡 Did you know?</h3>
        <p style="margin: 0;">
            Tracking your menopause symptoms consistently can help you identify patterns and triggers, 
            leading to more effective management strategies and better conversations with your healthcare provider.
        </p>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        This verification link will expire in 24 hours for security reasons. If you didn't create an account with Meno+, 
        you can safely ignore this email.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};