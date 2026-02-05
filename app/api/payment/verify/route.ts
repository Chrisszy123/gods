// app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await paystackResponse.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { 
          error: 'Payment verification failed', 
          details: data.message,
          verified: false 
        },
        { status: 400 }
      );
    }

    // Payment successful - extract data
    const {
      email,
      amount,
      reference: paymentRef,
      metadata,
    } = data.data;

    const { name, phone, category, registrationType, groupName } = metadata;

    // Send confirmation email
    try {
      await sendConfirmationEmail({
        to: email,
        name,
        reference: paymentRef,
        amount,
        category,
        registrationType,
        groupName,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      status: true,
      verified: true,
      message: 'Payment verified successfully',
      data: {
        email,
        name,
        phone,
        category,
        registrationType,
        groupName,
        amount: amount / 100, // Convert from kobo to naira
        reference: paymentRef,
        paid_at: data.data.paid_at,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        verified: false 
      },
      { status: 500 }
    );
  }
}
