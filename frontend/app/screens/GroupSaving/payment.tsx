import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { loadStripe, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RCacL2ZzKhsM88AR1iMtZz7uwImCp8yxbc2teDwDBNCzZi6IUj9iOVoLTAWIK6SUrwwouCkZ3XHhgyNm8G3SvKk000eAEMD3R');

// Payment Form Modal Component
const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md animate-fadeIn" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal Content */}
        <Elements stripe={stripePromise}>
          <CheckoutForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

const CheckoutForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState<number>(1000); // Amount in cents (e.g., $10.00)

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Fetch PaymentIntent from backend when component mounts
    const createPaymentIntent = async () => {
      try {
        console.log('Creating PaymentIntent...');
        const response = await fetch('http://localhost:8085/api/payments/payment_intents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount, // Amount in cents
            currency: 'usd', // Adjust as needed
            description: 'Test payment', // Optional
            userId: '122e4567-e89b-12d3-a456-426614174000', // Replace with actual user ID
            type: 'card', // Adjust as needed
          }),
        });

        const data = await response.json();
        console.log('PaymentIntent response:', data); // Log response

        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to create payment intent');
        }
      } catch (err) {
        console.error('Error creating PaymentIntent:', err);
        setError('Network error occurred');
      }
    };

    createPaymentIntent();
  }, [amount]); // Re-run if amount changes

  const handleChange = (event: StripeCardElementChangeEvent) => {
    console.log('Card Element Change:', event); // Log card element changes
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dollarAmount = parseFloat(e.target.value);
    if (!isNaN(dollarAmount)) {
      setAmount(Math.round(dollarAmount * 100));
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    console.log('Submit Payment: clientSecret:', clientSecret);
    console.log('Submit Payment: stripe:', stripe);
    console.log('Submit Payment: elements:', elements);

    if (!stripe || !elements || !clientSecret) {
      setError('Stripe or payment details not loaded');
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card details not entered');
      setProcessing(false);
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (payload.error) {
      console.error('Payment failed:', payload.error); // Log payment failure
      setError(payload.error.message || 'Payment failed');
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      console.log('Payment successful:', payload); // Log successful payment

      // Auto close after success (optional)
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#424770',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '1.375em',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px 0',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-6 px-6">
        <h2 className="text-2xl font-bold text-white text-center">Secure Payment</h2>
        <p className="mt-1 text-center text-white text-opacity-90">Your transaction is secure and encrypted</p>
      </div>
      
      <form className="p-6" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount ($)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              defaultValue="10.00"
              onChange={handleAmountChange}
              className="pl-7 block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
          <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Test card: 4242 4242 4242 4242 · Exp: Any future date · CVC: Any 3 digits
          </p>
        </div>

        <button
          disabled={processing || disabled || succeeded || !stripe || !clientSecret}
          className="w-full bg-indigo-600 py-3 px-4 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="submit"
        >
          {processing ? 'Processing...' : succeeded ? 'Payment Successful!' : 'Pay $10.00'}
        </button>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentModal;
