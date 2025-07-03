import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, planName, amount, updatePaymentUrl, supportEmail } = data;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Payment unsuccessful - Please update your payment method</h2>
    
    <p style="margin-bottom: 20px;">
        We were unable to process your payment for your ${planName} subscription (${formattedAmount}). 
        This could be due to an expired card, insufficient funds, or your bank blocking the transaction.
    </p>
    
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #dc2626; margin-bottom: 10px;">⚠️ Action Required</h3>
        <p style="margin: 0; color: #7f1d1d;">
            To avoid interruption of your Meno+ premium features, please update your payment method within the next 3 days.
        </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${updatePaymentUrl}" class="button">Update Payment Method</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What happens next?</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
            <div>
                <strong>Update your payment method</strong> - Click the button above to securely update your billing information
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
            <div>
                <strong>We'll retry the payment</strong> - Once updated, we'll automatically attempt to process your payment again
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
            <div>
                <strong>Continue with full access</strong> - Your premium features will remain active once payment is successful
            </div>
        </div>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Common reasons for payment failure:</h3>
    
    <ul style="margin: 0 0 20px 20px; color: #4b5563;">
        <li>Credit or debit card has expired</li>
        <li>Insufficient funds in the account</li>
        <li>Bank security measures blocking online transactions</li>
        <li>Card issuer requires authorization for subscription payments</li>
        <li>Billing address doesn't match card information</li>
    </ul>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">💡 Need help?</h3>
        <p style="margin: 0;">
            If you continue to experience payment issues after updating your payment method, 
            please contact your bank or card issuer to ensure they allow subscription payments to Meno+, 
            or reach out to our support team for assistance.
        </p>
    </div>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
            <strong>Your account is secure:</strong> We don't store your payment information. 
            All transactions are processed securely through our payment provider.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        Thank you for your prompt attention to this matter. We're here to help if you need any assistance updating your payment information.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};