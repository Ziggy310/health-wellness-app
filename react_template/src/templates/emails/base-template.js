// Base email template with Meno+ branding
export const baseTemplate = (content, data = {}) => {
  const { userName = 'there', supportEmail = 'support@menoplus.com' } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meno+</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4b5563;
        }
        
        .main-content {
            margin-bottom: 30px;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        
        .button:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
        }
        
        .health-tip {
            background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
            border-left: 4px solid #8b5cf6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #8b5cf6;
        }
        
        .stat-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-links {
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: #8b5cf6;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        
        .unsubscribe {
            font-size: 12px;
            color: #64748b;
            margin-top: 15px;
        }
        
        .unsubscribe a {
            color: #64748b;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .header, .content, .footer {
                padding: 20px 15px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Meno+</div>
            <div class="tagline">Your personalized menopause wellness companion</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi ${userName},</div>
            <div class="main-content">
                ${content}
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-links">
                <a href="https://menoplus.com/dashboard">Dashboard</a>
                <a href="https://menoplus.com/support">Support</a>
                <a href="https://menoplus.com/privacy">Privacy</a>
            </div>
            
            <div style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
                Questions? Reply to this email or contact us at 
                <a href="mailto:${supportEmail}" style="color: #8b5cf6;">${supportEmail}</a>
            </div>
            
            <div class="unsubscribe">
                <a href="{{unsubscribe_url}}">Unsubscribe</a> | 
                <a href="{{preferences_url}}">Email Preferences</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};