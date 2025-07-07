import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, resetUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Reset your password</h2>
    
    <p style="margin-bottom: 20px;">
        We received a request to reset the password for your Meno+ account. If you made this request, 
        click the button below to set a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
    </div>
    
    <p style="margin-bottom: 20px; font-size: 14px; color: #64748b;">
        If the button doesn't work, you can copy and paste this link into your browser:
        <br>
        <a href="${resetUrl}" style="color: #8b5cf6; word-break: break-all;">${resetUrl}</a>
    </p>
    
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #dc2626; margin-bottom: 10px;">🔒 Security Notice</h3>
        <p style="margin: 0; color: #7f1d1d;">
            This password reset link will expire in 1 hour for your security. If you didn't request a password reset, 
            you can safely ignore this email - your account remains secure.
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Tips for a strong password:</h3>
    
    <ul style="margin: 0 0 20px 20px; color: #4b5563;">
        <li>Use at least 8 characters</li>
        <li>Include uppercase and lowercase letters</li>
        <li>Add numbers and special characters</li>
        <li>Avoid using personal information</li>
        <li>Don't reuse passwords from other accounts</li>
    </ul>
    
    <p style="margin: 30px 0 0 0; font-size: 14px; color: #64748b;">
        If you continue to have trouble accessing your account, please don't hesitate to contact our support team. 
        We're here to help keep your health data secure and accessible.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};