import { useState } from 'react';
import api from '../../services/api'; // This is your axios instance
import { useAuth } from '../context/useAuth'; // Import your custom hook
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';

export const SubscribeButton = ({ amount = 500 }) => {
  const [loading, setLoading] = useState(false);
  const { user, fetchProfile } = useAuth(); // Get user and refresh function

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to join the league");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Razorpay Order on your Backend
      const { data: order } = await api.post('/payment/order', { amount });

      // 2. Configure Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Golf Charity League",
        description: "Monthly Prize Pool Entry",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify on Backend
            const { data } = await api.post('/payment/verify', {
              ...response,
              userId: user.id
            });

            if (data.success) {
              toast.success("Welcome to the League! ⛳");
              await fetchProfile(user); // Refresh the dashboard UI instantly
            }
          } catch (err) {
            toast.error("Verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "Golfer",
          email: user.email,
        },
        theme: { color: "#059669" }, // Matching your emerald-600 color
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Zap className="w-5 h-5 fill-current" />
          Join the Charity League
        </>
      )}
    </button>
  );
};