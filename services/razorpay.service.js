// src/services/razorpay.service.js
import axios from 'axios';

export const initializeRazorpayPayment = async (amount, userId, onSuccess) => {
  try {
    // 1. Get Order ID from your Backend
    const { data: order } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/order`, {
      amount
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Golf Charity Platform",
      order_id: order.id,
      handler: async (response) => {
        // 2. Verify on Backend
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/verify`, {
          ...response,
          userId
        });
        if (data.success) onSuccess(); 
      },
      theme: { color: "#1e40af" } // Your cinematic blue
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment failed", err);
  }
};