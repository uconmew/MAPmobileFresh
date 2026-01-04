import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, bookingId } = await request.json();

    if (!paymentIntentId || !bookingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.booking_id !== bookingId) {
      return NextResponse.json({ error: 'Payment intent does not match booking' }, { status: 400 });
    }

        if (paymentIntent.status === 'succeeded') {
          // If it was an arrival booking, update it to 'now' since it's now paid online
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ 
              payment_status: 'paid',
              status: 'confirmed',
              payment_method: 'now'
            })
            .eq('id', bookingId);

      if (updateError) {
        console.error('Failed to update booking:', updateError);
        return NextResponse.json({ 
          success: true, 
          status: paymentIntent.status,
          warning: 'Payment succeeded but booking update failed'
        });
      }

      return NextResponse.json({ 
        success: true, 
        status: paymentIntent.status,
        bookingStatus: 'paid'
      });
    }

    return NextResponse.json({ 
      success: false, 
      status: paymentIntent.status,
      message: 'Payment not yet complete'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
