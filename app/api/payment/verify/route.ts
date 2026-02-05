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
    const transactionData = data.data;
    
    // Email can be in different places in Paystack response
    const email = transactionData.customer?.email || transactionData.email;
    const amount = transactionData.amount;
    const paymentRef = transactionData.reference;
    const metadata = transactionData.metadata || {};

    const { name, phone, category, registrationType, groupName } = metadata;
    // Send confirmation email only if we have an email
    if (email) {
      try {
        await sendConfirmationEmail({
          to: email,
          name: name || 'Participant',
          reference: paymentRef,
          amount,
          category: category || 'Not specified',
          registrationType,
          groupName,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the whole request if email fails
      }
    } else {
      console.error('No email found in transaction data');
    }

    return NextResponse.json({
      status: true,
      verified: true,
      message: 'Payment verified successfully',
      data: {
        email: email || '',
        name: name || 'Participant',
        phone: phone || '',
        category: category || '',
        registrationType: registrationType || 'individual',
        groupName: groupName || '',
        amount: amount / 100, // Convert from kobo to naira
        reference: paymentRef,
        paid_at: transactionData.paid_at,
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
