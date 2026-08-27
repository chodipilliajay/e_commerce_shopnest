import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Sparkles, CreditCard, Lock } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

export default function Payment() {
  const { items, shippingInfo, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(null); // null = unknown yet, true/false once checked
  const [demoStage, setDemoStage] = useState('idle'); // idle | card | processing

  useEffect(() => {
    if (!shippingInfo || items.length === 0) navigate('/cart');
  }, [shippingInfo, items, navigate]);

  useEffect(() => {
    api.get('/payment/key').then(({ data }) => setDemoMode(data.demo)).catch(() => setDemoMode(true));
  }, []);

  const placeOrder = async (paymentInfo) => {
    try {
      const { data } = await api.post('/order/new', {
        shippingInfo,
        orderItems: items.map((i) => ({
          name: i.name, quantity: i.quantity, image: i.image, price: i.price, product: i.product,
        })),
        paymentInfo,
        itemsPrice, taxPrice, shippingPrice, totalPrice,
      });
      clearCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create your order. Please contact support.');
    }
  };

  // --- Real Razorpay flow ---
  const handleRealPayment = async () => {
    setProcessing(true);
    try {
      const { data: keyData } = await api.get('/payment/key');
      const { data: orderData } = await api.post('/payment/create', { amount: totalPrice });

      if (orderData.demo) {
        // Backend detected the configured keys don't actually work and fell back to demo mode.
        setDemoMode(true);
        setProcessing(false);
        toast('Payment gateway unavailable right now — switched to Demo Payment.', { icon: 'ℹ️' });
        return;
      }

      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'ShopNest',
        description: 'Order Payment',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await api.post('/payment/verify', response);
            if (verifyData.success) {
              await placeOrder({ id: response.razorpay_payment_id, status: 'paid' });
            } else {
              toast.error('Payment verification failed. If money was deducted, contact support.');
            }
          } catch {
            toast.error('Payment verification failed.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: shippingInfo?.phoneNo },
        theme: { color: '#FF6B4A' },
        modal: { ondismiss: () => setProcessing(false) },
      };

      if (!window.Razorpay) {
        toast.error('Payment gateway failed to load. Switching to Demo Payment.');
        setDemoMode(true);
        setProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed. Please try again.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment could not be started');
      setProcessing(false);
    }
  };

  // --- Demo payment flow (no real gateway needed) ---
  const handleDemoPayment = async () => {
    setDemoStage('processing');
    try {
      const { data: orderData } = await api.post('/payment/create', { amount: totalPrice });
      // Simulate a brief, realistic processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const fakePaymentId = `demo_pay_${Date.now()}`;
      await api.post('/payment/verify', { demo: true, razorpay_order_id: orderData.order.id, razorpay_payment_id: fakePaymentId });
      await placeOrder({ id: fakePaymentId, status: 'paid (demo)' });
    } catch (err) {
      toast.error('Could not complete demo payment. Please try again.');
      setDemoStage('card');
    }
  };

  if (!shippingInfo || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:px-8">
      <CheckoutSteps active={2} />

      {demoMode === null ? (
        <div className="rounded-xl2 border border-ink/10 bg-white p-8 text-center text-slate-soft">Loading payment options...</div>
      ) : demoMode ? (
        <DemoCheckout
          totalPrice={totalPrice}
          stage={demoStage}
          onStart={() => setDemoStage('card')}
          onPay={handleDemoPayment}
        />
      ) : (
        <div className="rounded-xl2 border border-ink/10 bg-white p-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-mint-dark" />
          <h1 className="font-display text-2xl font-700">Ready to Pay</h1>
          <p className="mt-2 text-slate-soft">You'll be charged</p>
          <p className="my-4 font-display text-4xl font-700">₹{totalPrice.toLocaleString('en-IN')}</p>
          <button onClick={handleRealPayment} disabled={processing} className="btn-primary w-full disabled:opacity-60">
            {processing ? 'Processing...' : 'Pay Securely with Razorpay'}
          </button>
          <p className="mt-4 text-xs text-slate-soft">Payments are encrypted and processed securely by Razorpay.</p>
        </div>
      )}
    </div>
  );
}

function DemoCheckout({ totalPrice, stage, onStart, onPay }) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-sun/40 bg-white">
      <div className="flex items-center gap-2 bg-sun/15 px-5 py-2.5 text-xs font-semibold text-sun-dark">
        <Sparkles className="h-3.5 w-3.5" /> DEMO MODE — no real payment gateway is connected, nothing will be charged
      </div>

      <div className="p-8 text-center">
        {stage === 'idle' && (
          <>
            <CreditCard className="mx-auto mb-4 h-12 w-12 text-brand" />
            <h1 className="font-display text-2xl font-700">Ready to Checkout</h1>
            <p className="mt-2 text-slate-soft">You'll "pay"</p>
            <p className="my-4 font-display text-4xl font-700">₹{totalPrice.toLocaleString('en-IN')}</p>
            <button onClick={onStart} className="btn-primary w-full">Continue to Payment</button>
          </>
        )}

        {stage === 'card' && (
          <div className="text-left">
            <h2 className="mb-5 text-center font-display text-xl font-700">Enter Card Details</h2>
            <div className="mb-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-soft">Card Number</label>
                <div className="input-field flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-soft" />
                  <span className="text-ink/40">4242 4242 4242 4242</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-soft">Expiry</label>
                  <div className="input-field text-ink/40">12 / 28</div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-soft">CVV</label>
                  <div className="input-field text-ink/40">•••</div>
                </div>
              </div>
            </div>
            <p className="mb-4 flex items-center gap-1.5 text-xs text-slate-soft"><Lock className="h-3 w-3" /> This is a simulated card form — any input is ignored, no real card is charged.</p>
            <button onClick={onPay} className="btn-primary w-full">Pay ₹{totalPrice.toLocaleString('en-IN')}</button>
          </div>
        )}

        {stage === 'processing' && (
          <div className="py-6">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-ink/10 border-t-brand" />
            <p className="font-medium">Processing your payment...</p>
            <p className="mt-1 text-sm text-slate-soft">This will only take a moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
