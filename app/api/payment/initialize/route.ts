// app/api/payment/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const paymentSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10),
  category: z.enum(['vocalist', 'dancer', 'actor', 'performer']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const { email, name, phone, category } = validatedData;

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: 300000, // ₦3000 in kobo (Paystack uses kobo)
        currency: 'NGN',
        metadata: {
          name,
          phone,
          category,
          custom_fields: [
            {
              display_name: 'Full Name',
              variable_name: 'name',
              value: name,
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone',
              value: phone,
            },
            {
              display_name: 'Category',
              variable_name: 'category',
              value: category,
            },
          ],
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      }),
    });

    const data = await paystackResponse.json();

    if (!data.status) {
      return NextResponse.json(
        { error: 'Failed to initialize payment', details: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: true,
      message: 'Payment initialized',
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      },
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
