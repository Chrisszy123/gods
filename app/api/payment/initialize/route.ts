// app/api/payment/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const paymentSchema = z.object({
  registrationType: z.enum(['individual', 'group']),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10),
  category: z.enum(['vocalist', 'dancer', 'actor', 'performer']),
  groupName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const { email, name, phone, category, registrationType, groupName } = validatedData;

    // Calculate amount based on registration type (Special offer prices)
    // Individual: ₦3,000 (300000 kobo) - Special offer from ₦5,000
    // Group: ₦5,000 (500000 kobo) - Special offer from ₦10,000
    const amount = registrationType === 'individual' ? 300000 : 500000;

    // Build custom fields array
    const customFields = [
      {
        display_name: 'Registration Type',
        variable_name: 'registration_type',
        value: registrationType === 'individual' ? 'Individual' : 'Group',
      },
    ];

    // Add group name if group registration
    if (registrationType === 'group' && groupName) {
      customFields.push({
        display_name: 'Group Name',
        variable_name: 'group_name',
        value: groupName,
      });
    }

    customFields.push(
      {
        display_name: registrationType === 'group' ? 'Contact Person' : 'Full Name',
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
      }
    );

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency: 'NGN',
        metadata: {
          name,
          phone,
          category,
          registrationType,
          ...(groupName && { groupName }),
          custom_fields: customFields,
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
