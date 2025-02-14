import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/payment.css';

const SubscriptionFlow = ({ user }) => {
  const [subscription, setSubscription] = useState({
    status: 'inactive',
    daysLeft: 0
  });

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get('/api/users/subscription');
        setSubscription(res.data);
      } catch (err) {
        console.error('Subscription check failed:', err);
      }
    };
    checkSubscription();
  }, []);

  useEffect(() => {
    // Ensure script loads even if cached version fails
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const upgradeSubscription = async () => {
    if (!window.Razorpay) {
      alert('Payment system is unavailable. Please refresh the page.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: 199900, // ₹1999.00
      currency: 'INR',
      name: 'Fitness App Premium',
      description: 'Annual Subscription',
      image: '/logo.png',
      handler: async (response) => {
        try {
          await axios.post('http://localhost:5000/api/subscriptions/verify', {
            paymentId: response.razorpay_payment_id
          });
          setSubscription({
            status: 'active',
            daysLeft: 365
          });
        } catch (err) {
          console.error('Payment verification failed:', err);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: { email: user.email },
      theme: { color: '#4299e1' }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      alert('Payment system error. Please try again later.');
    }
  };

  return (
    <div className="subscription-container">
      {subscription.status === 'active' ? (
        <div className="premium-status">
          <h3>⭐ Premium Member ({subscription.daysLeft} days remaining)</h3>
        </div>
      ) : (
        <div className="premium-offer">
          <h2>Get Premium Membership</h2>
          <div className="price-tag">₹1999/year</div>
          <button
            onClick={upgradeSubscription}
            className="premium-button"
          >
            Unlock Premium Access
          </button>
          <p className="disclaimer">
            Instant access to all premium features
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionFlow; 