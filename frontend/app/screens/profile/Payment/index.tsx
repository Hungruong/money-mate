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
        const response = await fetch('http://localhost:8085/api/payments/payment_intents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount, // Amount in cents
            currency: 'usd', // Adjust as needed
            description: 'Test payment', // Optional
            userId: 'c2b1f449-7025-49a1-9933-67fcc5c35829', // Replace with actual user ID
            type: 'card', // Adjust as needed
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to create payment intent');
        }
      } catch (err) {
        setError('Network error occurred');
      }
    };

    createPaymentIntent();
  }, [amount]); // Re-run if amount changes

  const handleChange = (event: StripeCardElementChangeEvent) => {
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
      setError(payload.error.message || 'Payment failed');
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      
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
          className="w-full bg-indigo-600 py-3 px-4 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span className="flex justify-center items-center">
            {processing ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing payment...
              </div>
            ) : (
              `Pay $${(amount / 100).toFixed(2)}`
            )}
          </span>
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md" role="alert">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {succeeded && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md">
            <div className="flex">
              <svg
                className="h-5 w-5 text-green-400 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Payment processed successfully!
            </div>
          </div>
        )}
      </form>
      
      <div className="bg-gray-50 py-4 px-6 flex items-center justify-center border-t border-gray-200">
        <div className="text-xs text-gray-500 flex items-center">
          <svg
            className="h-4 w-4 text-gray-400 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Secured by Stripe
        </div>
        
        <div className="flex ml-4 space-x-2">
          <img src="/api/placeholder/32/20" alt="Visa" className="h-5" />
          <img src="/api/placeholder/32/20" alt="Mastercard" className="h-5" />
          <img src="/api/placeholder/32/20" alt="Amex" className="h-5" />
        </div>
      </div>
    </div>
  );
};

// Sample implementation for integrating with your existing code
const PaymentButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Make Payment
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

// Usage example in your ProfileScreen or other component
const ExampleUsage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Account</h1>
      <p className="mb-6">Click the button below to make a payment</p>
      <PaymentButton />
    </div>
  );
};

export default ExampleUsage;