import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatTimeWindow(time: string): string {
  const [start] = time.split('-').map(t => t.trim());
  const hour = parseInt(start);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${formattedHour}:00 ${ampm} - ${formattedHour + 2}:00 ${ampm}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.cartItems && body.metadata?.type === 'cart_purchase') {
      const { cartItems } = body;
      
      const itemIds = cartItems.map((item: { id: string }) => item.id);
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, price')
        .in('id', itemIds);

      if (error || !products) {
        return NextResponse.json({ error: 'Failed to fetch product prices' }, { status: 500 });
      }

      let totalCents = 0;
      const productDetails: string[] = [];
      for (const item of cartItems) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          totalCents += Math.round(Number(product.price) * 100) * item.quantity;
          productDetails.push(`${product.name} x${item.quantity}`);
        }
      }

      if (totalCents < 50) {
        return NextResponse.json({ error: 'Minimum amount is $0.50' }, { status: 400 });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          type: 'cart_purchase',
          items_count: String(cartItems.length),
          cart_items: JSON.stringify(cartItems).slice(0, 500),
          product_summary: productDetails.join(', ').slice(0, 500),
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalCents / 100,
      });
    }

    if (body.amount) {
      return NextResponse.json({ error: 'Direct amount not allowed. Provide cartItems or bookingId.' }, { status: 400 });
    }

    const { bookingId, cartItems } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:service_id (name, description, base_price),
        vehicle:vehicle_id (make, model, year),
        address:address_id (street, city, state)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.payment_status === 'paid') {
      return NextResponse.json({ error: 'Booking already paid' }, { status: 400 });
    }

    let bookingAmountCents = Math.round(Number(booking.total_amount) * 100);
    let cartAmountCents = 0;
    let cartProductSummary = '';
    
    if (cartItems && cartItems.length > 0) {
      const itemIds = cartItems.map((item: { id: string }) => item.id);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')
        .in('id', itemIds);

      if (productsError || !products) {
        return NextResponse.json({ error: 'Failed to fetch cart product prices' }, { status: 500 });
      }

      const productDetails: string[] = [];
      for (const item of cartItems) {
        const product = products.find((p: { id: string }) => p.id === item.id);
        if (product) {
          cartAmountCents += Math.round(Number(product.price) * 100) * item.quantity;
          productDetails.push(`${product.name} x${item.quantity}`);
        }
      }
      cartProductSummary = productDetails.join(', ').slice(0, 400);
    }

    const totalAmountCents = bookingAmountCents + cartAmountCents;

    if (totalAmountCents < 50) {
      return NextResponse.json({ error: 'Minimum amount is $0.50' }, { status: 400 });
    }

    const serviceName = booking.service?.name || 'Mobile Installation Service';
    const vehicleInfo = booking.vehicle
      ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
      : 'Vehicle TBD';
    const locationInfo = booking.address
      ? `${booking.address.street}, ${booking.address.city}`
      : 'Location TBD';
    const isNoInstall = booking.scheduled_time === 'No Installation';
    const appointmentDate = booking.booking_date ? formatDate(booking.booking_date) : 'Purchase Only';
    const timeWindow = isNoInstall 
      ? 'Product Only' 
      : booking.scheduled_time
        ? formatTimeWindow(booking.scheduled_time)
        : 'Time TBD';

    const metadata: Record<string, string> = {
      type: cartItems && cartItems.length > 0 ? 'booking_with_cart' : 'booking',
      booking_id: bookingId,
      service_name: serviceName,
      vehicle: vehicleInfo,
      location: locationInfo,
      appointment_date: appointmentDate,
      time_window: timeWindow,
      is_no_install: String(isNoInstall),
      booking_amount: String(bookingAmountCents / 100),
    };

    if (cartItems && cartItems.length > 0) {
      metadata.cart_items_count = String(cartItems.length);
      metadata.cart_amount = String(cartAmountCents / 100);
      metadata.cart_items = JSON.stringify(cartItems).slice(0, 400);
      metadata.cart_summary = cartProductSummary;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmountCents / 100,
      bookingAmount: bookingAmountCents / 100,
      cartAmount: cartAmountCents / 100,
      serviceName,
      vehicleInfo,
      locationInfo,
      appointmentDate,
      timeWindow,
    });
  } catch (err: unknown) {
    console.error('Payment Intent Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
