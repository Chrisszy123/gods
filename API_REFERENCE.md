# API Reference - Gods of the Stage Payment System

## Overview

This document describes the API endpoints for the payment integration.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

---

## Endpoints

### 1. Initialize Payment

**POST** `/api/payment/initialize`

Initializes a Paystack payment transaction.

#### Request Body

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "08012345678",
  "category": "vocalist"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `name` | string | Yes | Full name (min 2 characters) |
| `phone` | string | Yes | Phone number (min 10 characters) |
| `category` | enum | Yes | One of: `vocalist`, `dancer`, `actor`, `performer` |

#### Success Response (200)

```json
{
  "status": true,
  "message": "Payment initialized",
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxx",
    "access_code": "xxx",
    "reference": "xxx"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid data
```json
{
  "error": "Invalid request data",
  "details": [...]
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

---

### 2. Verify Payment

**GET** `/api/payment/verify?reference=xxx`

Verifies a payment transaction and sends confirmation email.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | string | Yes | Paystack transaction reference |

#### Success Response (200)

```json
{
  "status": true,
  "verified": true,
  "message": "Payment verified successfully",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "08012345678",
    "category": "vocalist",
    "amount": 3000,
    "reference": "xxx",
    "paid_at": "2026-01-27T12:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Missing reference or verification failed
```json
{
  "error": "Payment verification failed",
  "details": "Error message",
  "verified": false
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "details": "Error message",
  "verified": false
}
```

---

## Payment Flow

```
1. User fills registration form
   ↓
2. Frontend calls /api/payment/initialize
   ↓
3. Backend creates Paystack transaction
   ↓
4. User redirected to Paystack checkout
   ↓
5. User completes payment
   ↓
6. Paystack redirects to /payment/callback?reference=xxx
   ↓
7. Callback page calls /api/payment/verify?reference=xxx
   ↓
8. Backend verifies payment with Paystack
   ↓
9. Backend sends confirmation email
   ↓
10. User sees success page
```

---

## Authentication

All API routes use server-side authentication with Paystack:

```typescript
Authorization: Bearer ${PAYSTACK_SECRET_KEY}
```

The secret key is stored in environment variables and never exposed to the client.

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:

- Rate limiting middleware
- Request throttling
- IP-based restrictions

---

## Error Handling

All endpoints return consistent error responses:

```typescript
{
  error: string;      // Human-readable error message
  details?: any;      // Additional error details
  verified?: boolean; // Payment verification status (verify endpoint only)
}
```

---

## Environment Variables Required

```bash
# Backend only
PAYSTACK_SECRET_KEY=sk_test_xxx

# Frontend accessible
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Gods of the Stage <noreply@godsofthestage.com>"
```

---

## Testing

### cURL Examples

**Initialize Payment:**
```bash
curl -X POST http://localhost:3000/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "08012345678",
    "category": "vocalist"
  }'
```

**Verify Payment:**
```bash
curl http://localhost:3000/api/payment/verify?reference=xxx
```

---

## Security Considerations

1. **Never expose secret keys** - Keep `PAYSTACK_SECRET_KEY` server-side only
2. **Validate all inputs** - Use Zod schema validation
3. **Verify payments server-side** - Never trust client-side payment status
4. **Use HTTPS in production** - Encrypt all data in transit
5. **Store sensitive data securely** - Use environment variables
6. **Implement logging** - Track payment attempts and failures
7. **Add webhook verification** - Verify Paystack webhook signatures

---

## Webhooks (Optional Enhancement)

For real-time payment notifications, you can set up Paystack webhooks:

**Webhook URL**: `https://yourdomain.com/api/webhooks/paystack`

**Events to subscribe:**
- `charge.success`
- `charge.failed`

This allows you to process payments without relying on user redirects.

---

## Support

For issues or questions:
- **Paystack Support**: support@paystack.com
- **Documentation**: https://paystack.com/docs

---

**Last Updated**: January 27, 2026
