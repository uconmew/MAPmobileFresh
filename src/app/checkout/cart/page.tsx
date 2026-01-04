"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, ShieldCheck, Lock, CreditCard, Loader2, CheckCircle, Mail, ShoppingBag, ArrowRight, AlertCircle, Trash2, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  agreedToTOS: boolean;
}

function PaymentForm({ clientSecret, amount, onSuccess, agreedToTOS }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !agreedToTOS) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setErrorMessage("Payment could not be completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-h-[400px] overflow-y-auto custom-scrollbar">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !agreedToTOS}
        className="w-full blue-gradient text-white font-black h-16 text-lg shadow-xl shadow-primary/20 rounded-xl flex flex-col items-center justify-center gap-1"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold font-sans">Processing...</span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2">
              Pay ${amount.toFixed(2)}
            </span>
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold font-sans">Secure Payment</span>
          </>
        )}
      </Button>
    </form>
  );
}

function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle className="h-12 w-12 text-white" />
        </motion.div>

        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
          Payment Successful!
        </h1>
        <p className="text-foreground/60 mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and a receipt will be sent to your email.
        </p>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center justify-center gap-3 text-primary mb-3">
            <Mail className="h-5 w-5" />
            <span className="font-bold text-sm uppercase tracking-widest">Confirmation Sent</span>
          </div>
          <p className="text-sm text-foreground/50">
            Check your inbox for order details and tracking information.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 blue-gradient text-white font-bold h-12">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-12 border-white/10 bg-white/5">
            <Link href="/dashboard">
              Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-[10px] text-foreground/40 mt-8 uppercase tracking-widest font-bold">
          Questions? Contact us at support@mapmobile.co
        </p>
      </div>
    </motion.div>
  );
}

export default function CartCheckoutPage() {
  const { cart, totalPrice: cartPrice, totalItems, clearCart, removeFromCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTOS, setAgreedToTOS] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", zip_code: "", label: "Home" });
  const [shippingRates, setShippingRates] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: addrData } = await supabase.from("addresses").select("*").eq("user_id", session.user.id);
        setAddresses(addrData || []);
        if (addrData?.[0]) setSelectedAddress(addrData[0]);
      }

      const { data: ratesData } = await supabase.from("shipping_rates").select("*").eq("active", true).limit(1).single();
      setShippingRates(ratesData);
    }
    init();
  }, []);

  const calculateShippingFee = () => {
    if (!shippingRates) return 0;
    
    const totalWeight = cart.reduce((sum, item) => sum + (Number(item.weight_lbs || 0) * item.quantity), 0);
    
    let fee = Number(shippingRates.base_fee);
    fee += Number(shippingRates.residential_surcharge);
    fee += totalWeight * Number(shippingRates.per_lb_rate);
    
    const state = selectedAddress?.state || newAddress.state;
    if (state?.toUpperCase() === 'CO') {
      fee += Number(shippingRates.co_retail_delivery_fee);
    }
    
    return fee;
  };

  const totalWithShipping = cartPrice + calculateShippingFee();

  const handleUpdatePaymentIntent = async () => {
    if (cart.length === 0) return;
    
    // Validate address before allowing payment intent creation
    if (!selectedAddress && (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip_code)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const cartItems = cart.map(item => ({ id: item.id, quantity: item.quantity }));
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartItems,
          metadata: { 
            type: "cart_purchase",
            shipping_address: selectedAddress ? JSON.stringify(selectedAddress) : JSON.stringify(newAddress),
            shipping_fee: calculateShippingFee().toString()
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Failed to initialize payment";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch intent when cart or shipping changes
  useEffect(() => {
    if (cart.length > 0 && (selectedAddress || (newAddress.street && newAddress.city && newAddress.state && newAddress.zip_code))) {
      handleUpdatePaymentIntent();
    }
  }, [cart, selectedAddress, newAddress.state]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    clearCart();
    toast.success("Payment successful!");
  };

  if (paymentSuccess) {
    return <SuccessView />;
  }

  if (totalItems === 0 && !paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-xl">
        <ShoppingCart className="h-16 w-16 text-foreground/20 mx-auto mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Your Cart is Empty</h1>
        <p className="text-foreground/60 mb-8">Add some premium electronics to your cart to proceed with checkout.</p>
        <Button asChild className="blue-gradient text-white font-bold h-12 px-8">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/products" className="inline-flex items-center text-sm font-bold text-primary mb-8 hover:opacity-70 transition-opacity">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary & Address */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h1 className="text-3xl font-black uppercase tracking-tight italic">Checkout</h1>
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {totalItems} Items
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Shipping Address</h2>
            {addresses.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => { setSelectedAddress(a); setNewAddress({ street: "", city: "", state: "", zip_code: "", label: "Home" }); }}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      selectedAddress?.id === a.id ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{a.street}</p>
                        <p className="text-[10px] text-foreground/60 uppercase font-bold">{a.city}, {a.state} {a.zip_code}</p>
                      </div>
                      {selectedAddress?.id === a.id && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => { setSelectedAddress(null); }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all ${
                !selectedAddress ? "border-primary bg-primary/5 text-primary" : "border-white/10 text-foreground/40 hover:border-white/30"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Use New Address</span>
            </button>

            {!selectedAddress && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-2"
              >
                <Input
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="bg-white/5 border-white/10 h-12"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="bg-white/5 border-white/10 h-12"
                  />
                  <Input
                    placeholder="State (e.g. CO)"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="bg-white/5 border-white/10 h-12"
                  />
                </div>
                <Input
                  placeholder="Zip Code"
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                  className="bg-white/5 border-white/10 h-12"
                />
              </motion.div>
            )}
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">Item List</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                <div className="h-16 w-16 relative rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm italic">{item.name}</h3>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-primary text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                  </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                <span>Subtotal</span>
                <span>${cartPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                <span>Shipping & Handling (UPS Ground)</span>
                <span className="text-primary">${calculateShippingFee().toFixed(2)}</span>
              </div>
              {(selectedAddress?.state?.toUpperCase() === 'CO' || newAddress.state?.toUpperCase() === 'CO') && (
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  <span>CO Retail Delivery Fee</span>
                  <span>${Number(shippingRates?.co_retail_delivery_fee || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest italic">Grand Total</span>
                <span className="text-4xl font-black text-primary italic leading-none">${totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Area */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 h-fit sticky top-24">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Secure Checkout</h2>
            <p className="text-sm text-foreground/60">Finalize your premium hardware order.</p>
          </div>

            <AnimatePresence mode="wait">
              {(!selectedAddress && !newAddress.zip_code) ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center"
                >
                  <MapPin className="h-10 w-10 text-amber-500/30 mx-auto mb-4" />
                  <p className="text-sm text-amber-500 font-bold uppercase tracking-widest">Address Required</p>
                  <p className="text-[10px] text-foreground/40 mt-1">Please provide a shipping address to enable payment.</p>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-sm text-foreground/60">Recalculating total...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpdatePaymentIntent}
                    className="w-full blue-gradient text-white font-bold h-12"
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : clientSecret && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="tos"
                        checked={agreedToTOS}
                        onChange={(e) => setAgreedToTOS(e.target.checked)}
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                      />
                      <label htmlFor="tos" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">
                        I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      </label>
                    </div>
                  </div>

                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#0066FF",
                          colorBackground: "#1a1a1a",
                          colorText: "#ffffff",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <PaymentForm
                      clientSecret={clientSecret}
                      amount={totalWithShipping}
                      onSuccess={handlePaymentSuccess}
                      agreedToTOS={agreedToTOS}
                    />
                  </Elements>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/40">Secure SSL</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/40">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
