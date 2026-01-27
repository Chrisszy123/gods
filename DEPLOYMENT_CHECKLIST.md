# 🚀 Production Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## Pre-Deployment Checklist

### 1. Environment Variables ✅

- [ ] Obtained Paystack **LIVE** keys (pk_live_ and sk_live_)
- [ ] Updated `.env.local` or hosting platform with live keys
- [ ] Set production `NEXT_PUBLIC_APP_URL` (e.g., https://godsofthestage.com)
- [ ] Configured email service for production (not test credentials)
- [ ] Verified `EMAIL_FROM` uses your domain or authorized email
- [ ] All environment variables added to hosting platform
- [ ] `.env.local` is in `.gitignore` (already done)

### 2. Payment Testing ✅

- [ ] Made successful test payment in TEST mode
- [ ] Verified payment shows in Paystack dashboard
- [ ] Confirmed confirmation email arrives
- [ ] Tested payment callback/success page
- [ ] Tested failed payment scenario
- [ ] Verified payment amounts are correct (₦3,000)

### 3. Email Configuration ✅

- [ ] Email service configured for production
- [ ] Sender email domain verified (if using custom domain)
- [ ] SPF records configured for email domain
- [ ] DKIM configured for email domain
- [ ] Test email sent successfully
- [ ] Confirmation email template reviewed
- [ ] Email lands in inbox (not spam)

### 4. Security ✅

- [ ] HTTPS enabled on production domain
- [ ] Secret keys not exposed in client-side code
- [ ] Environment variables secured
- [ ] API routes not exposing sensitive data
- [ ] Input validation working on all forms
- [ ] Payment verification done server-side

### 5. Code Quality ✅

- [ ] No console.log statements in production code
- [ ] All TypeScript errors resolved
- [ ] Linting passes without errors
- [ ] Build completes successfully (`pnpm build`)
- [ ] All imports working correctly
- [ ] No unused dependencies

### 6. Testing ✅

- [ ] Registration form validation works
- [ ] Payment modal opens correctly
- [ ] Paystack popup displays properly
- [ ] Payment success page renders
- [ ] Payment failure page renders
- [ ] Email confirmation received
- [ ] Mobile responsive design verified
- [ ] Tested on multiple browsers

### 7. Paystack Configuration ✅

- [ ] Business information complete in Paystack dashboard
- [ ] Bank account verified for settlements
- [ ] Settlement schedule configured
- [ ] Webhook URL configured (optional but recommended)
- [ ] Callback URL correct in code
- [ ] Payment channels enabled (cards, bank transfer, etc.)

### 8. Performance ✅

- [ ] Images optimized
- [ ] Fonts loading correctly
- [ ] No performance bottlenecks
- [ ] API response times acceptable
- [ ] Page load time under 3 seconds

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy if needed

5. **Set Production Domain:**
   - Go to Domains in Vercel
   - Add your custom domain
   - Update `NEXT_PUBLIC_APP_URL` to match

### Option 2: Other Platforms

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Railway:**
```bash
npm i -g railway
railway up
```

**Digital Ocean App Platform:**
- Connect GitHub repository
- Configure environment variables
- Deploy

## Post-Deployment Checklist

### 1. Verification ✅

- [ ] Site loads at production URL
- [ ] HTTPS working (green padlock in browser)
- [ ] All pages accessible
- [ ] Registration modal opens
- [ ] Paystack payment popup works
- [ ] Payment callback URL correct

### 2. Live Testing ✅

- [ ] Make a small real payment (₦100-500 for testing)
- [ ] Verify payment appears in Paystack dashboard
- [ ] Confirm email arrives at real email address
- [ ] Check payment callback works
- [ ] Verify success page displays correctly

### 3. Monitoring ✅

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up payment notifications
- [ ] Enable Paystack email notifications
- [ ] Monitor email delivery rates

### 4. Documentation ✅

- [ ] Update README with production URL
- [ ] Document any custom configuration
- [ ] Create support/FAQ page (optional)
- [ ] Share credentials with team securely

## Environment Variables Template for Hosting Platform

Copy and paste these into your hosting platform's environment variables:

```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Gods of the Stage <noreply@godsofthestage.com>"
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Quick Commands

**Build locally:**
```bash
pnpm build
pnpm start
```

**Test production build:**
```bash
pnpm build && pnpm start
```

**Check for errors:**
```bash
pnpm lint
```

## Troubleshooting

### Payment not working in production

1. Verify live Paystack keys are used
2. Check browser console for errors
3. Verify `NEXT_PUBLIC_APP_URL` matches your domain
4. Ensure callback URL is accessible
5. Check Paystack dashboard for declined transactions

### Email not sending

1. Verify email credentials in production
2. Check sender domain is verified
3. Look for emails in spam folder
4. Verify SMTP settings are correct
5. Check email service rate limits

### Environment variables not loading

1. Redeploy after adding variables
2. Verify variable names match exactly
3. Check for typos in variable names
4. Ensure `NEXT_PUBLIC_` prefix for client variables
5. Clear cache and redeploy

### Build failing

1. Run `pnpm build` locally to see errors
2. Check all imports are correct
3. Verify all dependencies installed
4. Ensure TypeScript errors are resolved
5. Check node version compatibility

## Rollback Plan

If something goes wrong:

1. **Immediate:** Revert to previous deployment in hosting dashboard
2. **Code:** Git revert to last working commit
3. **Environment:** Double-check all environment variables
4. **Support:** Contact Paystack support if payment issues

## Support Contacts

- **Paystack Support:** support@paystack.com
- **Paystack Phone:** +234 1 888 3666
- **Vercel Support:** https://vercel.com/support

## Success Metrics to Track

- Total registrations
- Payment success rate
- Email delivery rate
- Page load time
- Error rate
- User drop-off points

## Final Pre-Launch

- [ ] Team notified of go-live time
- [ ] Support email set up for user inquiries
- [ ] Payment confirmation tested end-to-end
- [ ] Backup plan in place
- [ ] Monitoring enabled
- [ ] All team members have access to dashboards

## 🎉 You're Ready to Launch!

Once all checkboxes are complete, you're ready to accept real payments!

**Good luck with Gods of the Stage!** 🎭

---

**Remember:** Start with a soft launch to a small audience, monitor closely, and scale up as confidence builds.
