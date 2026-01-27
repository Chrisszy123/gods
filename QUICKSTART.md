# Quick Start Guide - 5 Minutes to Payment Integration

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies (30 seconds)

```bash
pnpm add react-paystack nodemailer @types/nodemailer zod
```

### Step 2: Get Your Paystack Keys (2 minutes)

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Click **Settings** → **API Keys & Webhooks**
3. Copy your **Public Key** and **Secret Key**

### Step 3: Setup Email (2 minutes)

**Option A: Gmail (Easiest)**
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Create app password for "Mail"
3. Copy the password

**Option B: Use any SMTP service** (SendGrid, Mailgun, etc.)

### Step 4: Configure Environment (30 seconds)

Edit `.env.local` and add your credentials:

```bash
# Paystack Keys (from Step 2)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
PAYSTACK_SECRET_KEY=sk_test_your_key_here

# Email Settings (from Step 3)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM="Gods of the Stage <noreply@godsofthestage.com>"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run and Test (1 minute)

```bash
pnpm dev
```

Visit `http://localhost:3000`, click "Audition Now", and use this test card:

**Card:** `5060 6666 6666 6666 666`  
**CVV:** `123`  
**Expiry:** Any future date  
**PIN:** `1234`

## ✅ You're Done!

The payment system is fully functional:
- ✅ User fills registration form
- ✅ Pays ₦3,000 via Paystack
- ✅ Gets confirmation email
- ✅ Sees success page

## 📝 What Was Implemented?

### Files Created:
```
components/
  └── PaymentModal.tsx          # Registration form + Paystack integration
app/
  ├── api/
  │   └── payment/
  │       ├── initialize/
  │       │   └── route.ts      # Initialize payment API
  │       └── verify/
  │           └── route.ts      # Verify payment API
  └── payment/
      └── callback/
          └── page.tsx          # Success/failure page
lib/
  └── email.ts                  # Email sending utility
.env.local                      # Environment variables
.env.example                    # Example environment file
```

### Updated Files:
```
app/page.tsx                    # Added payment button + modal
```

## 🎯 Key Features

1. **Beautiful UI** - Professional registration modal
2. **Form Validation** - Client-side + server-side validation
3. **Secure Payment** - Paystack PCI-compliant checkout
4. **Payment Verification** - Server-side verification for security
5. **Email Confirmation** - Automatic HTML email with details
6. **Success Page** - Professional callback with status
7. **Error Handling** - Comprehensive error messages
8. **Mobile Responsive** - Works perfectly on all devices

## 💳 Payment Flow

```
User clicks "Audition Now"
   ↓
Fills registration form (name, email, phone, category)
   ↓
Clicks "Proceed to Payment"
   ↓
Paystack popup opens
   ↓
User enters card details
   ↓
Payment processed
   ↓
Redirected to success page
   ↓
Email sent automatically
   ↓
Registration complete! 🎉
```

## 🧪 Testing

### Test Cards

**Success:**
- Card: `5060 6666 6666 6666 666`
- CVV: `123`
- Date: Any future date
- PIN: `1234`

**Failure:**
- Card: `5060 0000 0000 0000 097`

[More test cards](https://paystack.com/docs/payments/test-payments)

## 🌍 Going to Production

When ready to go live:

1. **Switch to live keys** in `.env.local`:
   ```bash
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
   PAYSTACK_SECRET_KEY=sk_live_xxx
   ```

2. **Update app URL**:
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Deploy** (Vercel recommended):
   ```bash
   vercel
   ```

4. **Add environment variables** in your hosting platform

5. **Test with a real payment** (make a small test transaction)

## 💰 Change Payment Amount

Default is ₦3,000. To change:

**File 1:** `components/PaymentModal.tsx` (line ~75)
```typescript
amount: 300000, // Change this (in kobo: ₦3000 = 300000)
```

**File 2:** `app/api/payment/initialize/route.ts` (line ~22)
```typescript
amount: 300000, // Change this (in kobo)
```

**Note:** Multiply Naira by 100 to get kobo (e.g., ₦5,000 = 500000 kobo)

## 🐛 Troubleshooting

**Modal not opening?**
- Check if packages are installed: `pnpm install`
- Verify `.env.local` has `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

**Payment fails?**
- Use correct test card
- Check Paystack dashboard for errors
- Verify secret key is correct

**Email not sending?**
- Check spam folder
- Verify email credentials
- Use App Password for Gmail (not regular password)

**Import errors?**
- Run `pnpm install` again
- Check if `@/*` path alias works in `tsconfig.json`

## 📚 Need More Help?

Check these files:
- `SETUP.md` - Comprehensive setup guide
- `API_REFERENCE.md` - API documentation
- [Paystack Docs](https://paystack.com/docs)

## 🎉 Congratulations!

You now have a production-ready payment system with:
- Secure payment processing
- Email confirmations
- Professional UI/UX
- Full error handling

**Start accepting payments now!** 💰

---

**Gods of the Stage** - Where talent becomes legendary 🎭
