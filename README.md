This is a [Next.js](https://nextjs.org) project for **Gods of the Stage** - A premium talent hunt platform with integrated Paystack payment processing.

## 🚀 Quick Start

**New to the payment integration? Start here:**

📖 **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes

### Installation

```bash
pnpm install
pnpm add react-paystack nodemailer @types/nodemailer zod
```

### Configure Environment

Copy `.env.example` to `.env.local` and add your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Paystack and email credentials.

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 🎭 Features

- ✅ **Beautiful Landing Page** - Mobile-first design with animations
- ✅ **Payment Integration** - Secure Paystack payment processing
- ✅ **Email Notifications** - Automatic confirmation emails
- ✅ **Registration System** - Complete audition registration flow
- ✅ **Payment Verification** - Server-side payment validation
- ✅ **Professional UI** - Custom fonts and gradient designs

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[SETUP.md](./SETUP.md)** - Comprehensive setup documentation
- **[API_REFERENCE.md](./API_REFERENCE.md)** - API endpoints reference

## 🏗️ Project Structure

```
gods/
├── app/
│   ├── api/payment/          # Payment API routes
│   ├── payment/callback/     # Payment callback page
│   ├── page.tsx              # Main landing page
│   └── layout.tsx            # Root layout
├── components/
│   └── PaymentModal.tsx      # Registration modal
├── lib/
│   └── email.ts              # Email utility
├── public/                   # Static assets
└── .env.local               # Environment variables (create this)
```

## 💳 Payment System

**Amount:** ₦3,000 per registration

**Provider:** Paystack (PCI-compliant, secure)

**Flow:**
1. User clicks "Audition Now"
2. Fills registration form
3. Pays via Paystack
4. Receives confirmation email
5. Registration complete

## 🧪 Testing

Use Paystack test cards:

**Success:** `5060 6666 6666 6666 666` (CVV: 123)

[More test cards](https://paystack.com/docs/payments/test-payments)

## 🌍 Deployment

Deploy on Vercel (recommended):

```bash
vercel
```

**Important:** Add environment variables in Vercel dashboard before deploying.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Paystack Documentation](https://paystack.com/docs)
- [React Paystack](https://github.com/iamraphson/react-paystack)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
