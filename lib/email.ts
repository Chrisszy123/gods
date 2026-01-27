// lib/email.ts
import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  name: string;
  reference: string;
  amount: number;
  category: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendConfirmationEmail({
  to,
  name,
  reference,
  amount,
  category,
}: SendEmailParams) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🎭 Registration Confirmed - Gods of the Stage',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmed</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #febf53 0%, #d5421e 100%);
              color: #000;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
              margin: -30px -30px 30px -30px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 20px 0;
            }
            .info-box {
              background-color: #f8f9fa;
              border-left: 4px solid #d5421e;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              color: #000;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #e0e0e0;
              margin-top: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #febf53 0%, #d5421e 100%);
              color: #000;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎭 Gods of the Stage</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Registration Confirmed!</p>
            </div>
            
            <div class="content">
              <h2 style="color: #d5421e;">Welcome, ${name}!</h2>
              <p>Your registration for <strong>Gods of the Stage</strong> has been successfully confirmed. Get ready to showcase your talent and shine on stage!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #d5421e;">Registration Details</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value">${to}</span>
                </div>
                <div class="info-row">
                  <span class="label">Category:</span>
                  <span class="value">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </div>
                <div class="info-row">
                  <span class="label">Amount Paid:</span>
                  <span class="value">₦${(amount / 100).toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Reference:</span>
                  <span class="value">${reference}</span>
                </div>
              </div>

              <h3 style="color: #d5421e;">What's Next?</h3>
              <ul style="line-height: 2;">
                <li>📧 Keep an eye on your email for audition schedules</li>
                <li>🎯 Prepare your best performance piece</li>
                <li>💪 Get ready to dominate the stage</li>
                <li>⭐ Join our community on social media</li>
              </ul>

              <p style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #febf53;">
                <strong>Important:</strong> Save this email for your records. You'll need your reference number for check-in at the audition.
              </p>
            </div>

            <div class="footer">
              <p><strong>Gods of the Stage</strong></p>
              <p>Lights. Crowd. Power. This is not a competition, it's a coronation.</p>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                © ${new Date().getFullYear()} Gods of the Stage. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Gods of the Stage - Registration Confirmed!

Welcome, ${name}!

Your registration for Gods of the Stage has been successfully confirmed.

Registration Details:
- Name: ${name}
- Email: ${to}
- Category: ${category.charAt(0).toUpperCase() + category.slice(1)}
- Amount Paid: ₦${(amount / 100).toLocaleString()}
- Reference: ${reference}

What's Next?
- Keep an eye on your email for audition schedules
- Prepare your best performance piece
- Get ready to dominate the stage
- Join our community on social media

Important: Save this email for your records. You'll need your reference number for check-in at the audition.

© ${new Date().getFullYear()} Gods of the Stage. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email server verification failed:', error);
    return false;
  }
}
