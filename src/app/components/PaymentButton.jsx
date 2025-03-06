import { div } from "framer-motion/client";
import Script from "next/script";
import React, { useEffect } from "react";

const PaymentButton = ({ amount, paymentSuccess}) => {

  const handlePayment = async () => {
    try {
      // Step 1: Create an order using your backend API
      const response = await fetch("http://localhost:5001/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount, // Amount in INR
          currency: "INR",
          receipt: "receipt_test_001",
        }),
      });

      const { order } = await response.json();

      if (!order) {
        alert("Failed to create order");
        return;
      }

      // Step 2: Verify Razorpay script is loaded
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK failed to load. Please refresh the page.");
        return;
      }

      // Step 3: Initiate Razorpay Payment
      const options = {
        key: "rzp_test_6nr1Kj7gZSDb5v", // Replace with your Razorpay Key ID
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Test Payment",
        description: "Test Transaction",
        order_id: order.id, // Order ID from the backend
        handler: function (response) {
          // alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          paymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    <button
      onClick={handlePayment}
      style={{
        padding: "10px 20px",
        backgroundColor: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Pay ₹{amount}
    </button>
    </div>
  );
};

export default PaymentButton;
