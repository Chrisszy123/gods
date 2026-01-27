# Gods of the Stage - Payment Integration Setup Guide

## 🎭 Complete Paystack Payment Integration

This guide will help you set up the payment system for the Gods of the Stage audition registration.

## 📦 Prerequisites

1. **Paystack Account**: Sign up at [https://paystack.com](https://paystack.com)
2. **Email Service**: Gmail account or any SMTP service
3. **Node.js**: Version 18+ recommended

## 🚀 Installation

### 1. Install Dependencies

```bash
pnpm add react-paystack nodemailer @types/nodemailer zod
```

Or if using npm:

```bash
npm install react-paystack nodemailer @types/nodemailer zod
```

Or if using yarn:

```bash
yarn add react-paystack nodemailer @types/nodemailer zod
```

### 2. Configure Paystack

1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy your:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Email (Gmail Example)

1. Log in to your Gmail account
2. Enable 2-Factor Authentication if not already enabled
3. Go to **Google Account** → **Security** → **App Passwords**
4. Create a new App Password for "Mail"
5. Copy the generated password

**Alternative Email Services:**
- **SendGrid**: Use their SMTP credentials
- **Mailgun**: Use their SMTP settings
- **AWS SES**: Configure with SES credentials
- **Custom SMTP**: Any SMTP server

### 4. Environment Variables

Update `.env.local` with your credentials:

```bash
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password_here
EMAIL_FROM="Gods of the Stage <noreply@godsofthestage.com>"

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production:**
- Use `pk_live_` and `sk_live_` keys from Paystack
- Update `NEXT_PUBLIC_APP_URL` to your production domain

## 🎯 Features Implemented

### ✅ Frontend
- **Payment Modal**: Beautiful form to collect user details
- **Form Validation**: Client-side validation for all fields
- **Paystack Integration**: Seamless payment popup
- **Success/Failure Pages**: Professional callback pages with payment status

### ✅ Backend
- **Payment Initialization API**: `/api/payment/initialize`
- **Payment Verification API**: `/api/payment/verify`
- **Email Notifications**: Automatic confirmation emails with registration details

### ✅ Security
- Environment variables for sensitive data
- Server-side payment verification
- Input validation with Zod
- Secure API routes

## 📝 How It Works

1. **User clicks "Audition Now"** → Opens registration modal
2. **User fills form** → Name, email, phone, category
3. **Form submission** → Calls `/api/payment/initialize`
4. **Paystack popup opens** → User enters card details
5. **Payment processed** → Paystack handles the transaction
6. **Redirect to callback** → `/payment/callback?reference=xxx`
7. **Verification** → Calls `/api/payment/verify` to confirm payment
8. **Email sent** → Confirmation email with registration details
9. **Success screen** → Shows registration confirmation

## 🧪 Testing

### Test Mode (Free)

Use Paystack test cards:

**Successful Payment:**
- Card Number: `5060 6666 6666 6666 666`
- CVV: `123`
- Expiry: Any future date
- PIN: `1234` (if required)

**Failed Payment:**
- Card Number: `5060 0000 0000 0000 097`

More test cards: [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)

### Testing Steps

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Audition Now" button

4. Fill in the registration form

5. Use a test card for payment

6. Verify:
   - Payment success page appears
   - Email confirmation received
   - Payment shows in Paystack dashboard

## 🌍 Production Deployment

### Before Going Live:

1. **Switch to Live Keys**:
   ```bash
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
   PAYSTACK_SECRET_KEY=sk_live_xxx
   ```

2. **Update App URL**:
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Email Configuration**:
   - Consider using a professional email service (SendGrid, Mailgun)
   - Set up proper domain authentication (SPF, DKIM)

4. **Security Checklist**:
   - ✅ Environment variables secured
   - ✅ HTTPS enabled
   - ✅ No secrets in code
   - ✅ .env.local in .gitignore

5. **Test in Production**:
   - Make a small test payment
   - Verify email delivery
   - Check payment dashboard

### Deployment Platforms:

**Vercel (Recommended for Next.js):**
```bash
vercel
```
Add environment variables in Vercel dashboard.

**Other Platforms:**
- Netlify
- AWS Amplify
- Digital Ocean
- Railway

## 📊 Payment Amount

Current setting: **₦3,000** (3000 Naira)

To change the amount, update in two places:

1. **Frontend Modal** (`components/PaymentModal.tsx`):
   ```typescript
   amount: 300000, // Amount in kobo (₦3000)
   ```

2. **Backend API** (`app/api/payment/initialize/route.ts`):
   ```typescript
   amount: 300000, // ₦3000 in kobo
   ```

**Note**: Paystack uses kobo (1 Naira = 100 kobo), so multiply by 100.

## 📧 Email Customization

To customize the confirmation email, edit:
```
lib/email.ts
```

You can modify:
- Email subject
- HTML template
- Sender name
- Email content

## 🐛 Troubleshooting

### Payment not initializing
- Check Paystack secret key is correct
- Verify `.env.local` is loaded
- Check console for errors

### Email not sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" (Gmail)
- Use App Password for Gmail

### Payment verification fails
- Ensure callback URL is correct
- Check Paystack webhook settings
- Verify secret key in environment

### Modal not opening
- Check if `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
- Verify React Paystack is installed
- Check browser console for errors

## 📚 Additional Resources

- [Paystack Documentation](https://paystack.com/docs)
- [React Paystack](https://github.com/iamraphson/react-paystack)
- [Nodemailer Documentation](https://nodemailer.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎉 You're All Set!

Your payment integration is now fully functional and production-ready. Users can register for auditions, make payments, and receive confirmation emails automatically.

For support, contact: [your-email@example.com]

---

**Gods of the Stage** - Lights. Crowd. Power. This is not a competition, it's a coronation.
