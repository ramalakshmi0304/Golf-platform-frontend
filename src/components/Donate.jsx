import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { fireSuccessConfetti } from '../utils/confetti'; // 👈 1. Import the utility
const [showSuccess, setShowSuccess] = useState(false);
const [lastTx, setLastTx] = useState(null);

const Donate = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (amount) => {
    if (!user) return alert("Please login first!");
    setIsProcessing(true);

    try {
      const { data: order } = await axios.post('http://localhost:5000/api/payment/order', { amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Golf Charity Platform",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyData = { ...response, userId: user.id };
            const { data } = await axios.post('http://localhost:5000/api/payment/verify', verifyData);

            if (data.success) {
              // ✅ 2. TRIGGER CELEBRATION
              fireSuccessConfetti();

              // ✅ 3. TRIGGER THE REFRESH
              await fetchProfile(user);
              alert("Tournament Entry Confirmed! ⛳");
            }
          } catch (error) {
            console.error("Verification failed", error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: { name: user.user_metadata?.full_name, email: user.email },
        theme: { color: "#1e40af" },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  if (data.success) {
    fireSuccessConfetti();
    await fetchProfile(user);

    // Set the data and show modal instead of alert
    setLastTx({ amount: 500, razorpay_payment_id: response.razorpay_payment_id });
    setShowSuccess(true);
  }

  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 text-center max-w-sm mx-auto">
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
        {profile?.role || 'Guest'}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Support & Play</h2>
      <p className="mt-2 text-gray-500 mb-8">Join the monthly prize pool for just ₹500.</p>

      <button
        disabled={isProcessing}
        onClick={() => handlePayment(500)}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold shadow-lg transform transition hover:-translate-y-1 active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? "Connecting..." : "Pay Now"}
      </button>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        txDetails={lastTx}
        onDownload={() => {/* Call your generateReceipt function here */ }}
      />
    </div>
  );
};

export default Donate;