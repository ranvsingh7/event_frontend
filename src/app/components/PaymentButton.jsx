import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const PaymentButton = ({ amount, paymentSuccess, customerData }) => {
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Initialize Cashfree SDK
    const initializeSDK = async () => {
      try {
        const mode = process.env.NODE_ENV === "development" ? "sandbox" : "production";
        const sdkInstance = await load({ mode });
        setCashfree(sdkInstance);
      } catch (error) {
        console.error("Error initializing Cashfree SDK:", error);
      }
    };
    initializeSDK();
  }, []);

  const getSessionId = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/cashfree/payment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          customer_name: customerData.customer_name,
          customer_email: customerData.customer_email,
          customer_phone: customerData.customer_phone,
          customer_id: customerData.customer_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.payment_session_id) {
        setOrderId(data.order_id);
        return {
          payment_session_id: data.payment_session_id,
          order_id: data.order_id,
        };
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching session ID:", error);
      throw error;
    }
  };

  const verifyPayment = async (order_id) => {
    try {
      const response = await fetch("http://localhost:5001/api/cashfree/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order_id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data) {
        paymentSuccess(data[0]);
      } else {
        console.error("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cashfree) {
      console.error("Cashfree SDK is not initialized.");
      return;
    }

    try {
      const sessionData = await getSessionId();

      const checkoutOptions = {
        paymentSessionId: sessionData.payment_session_id,
        redirectTarget: "_modal",
      };

      cashfree
        .checkout(checkoutOptions)
        .then(() => {
          verifyPayment(sessionData.order_id);
        })
        .catch((error) => {
          console.error("Error during checkout:", error);
        });
    } catch (error) {
      console.error("Error handling payment:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={amount <= 0}
        style={{
          padding: "10px 20px",
          backgroundColor: amount > 0 ? "#3399cc" : "#cccccc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: amount > 0 ? "pointer" : "not-allowed",
        }}
      >
        Pay ₹{amount}
      </button>
    </div>
  );
};

export default PaymentButton;
