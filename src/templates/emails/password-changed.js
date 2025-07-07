import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your password has been changed</h2>
    
    <p style="margin-bottom: 20px;">
        This email confirms that the password for your Meno+ account has been successfully changed.
    </p>
    
    <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #15803d; margin-bottom: 10px;">✅ Password Updated Successfully</h3>
        <p style="margin: 0; color: #166534;">
            Your account is secure and you can continue using Meno+ with your new password.
        </p>
    </div>
    
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #dc2626; margin-bottom: 10px;">🔒 Didn't make this change?</h3>
        <p style="margin: 0; color: #7f1d1d;">
            If you didn't change your password, please contact our support team immediately at 
            <a href="mailto:${supportEmail}" style="color: #dc2626;">${supportEmail}</a>. 
            Your account security is our top priority.
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Account security reminders:</h3>
    
    <ul style="margin: 0 0 20px 20px; color: #4b5563;">
        <li>Keep your password secure and don't share it with anyone</li>
        <li>Use a unique password that you don't use for other accounts</li>
        <li>Log out of shared or public devices after using Meno+</li>
        <li>Contact us immediately if you notice any suspicious activity</li>
    </ul>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
            <strong>Stay secure:</strong> We'll never ask for your password via email. 
            Always log in directly through our official website or app.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        Thank you for keeping your Meno+ account secure. If you have any questions or concerns, 
        don't hesitate to reach out to our support team.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};