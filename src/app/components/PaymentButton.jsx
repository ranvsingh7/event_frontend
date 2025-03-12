import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";

const PaymentButton = ({ amount, paymentSuccess, customerData }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  let cashfree;
    var initializeSDK = async function () {          
        cashfree = await load({
            mode: "sandbox"
        });
    }
    initializeSDK();


    const createOrder = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/cashfree/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_amount: amount,
            customer_details: customerData,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create order");
        }
  
        const data = await response.json();
        // console.log(data.data.order_id)
        const id = {
          payment_session_id:data.data.payment_session_id,
          order_id: data.data.order_id
        }
        return id;
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Failed to initiate payment. Please try again.");
        return null;
      }
    };

    const doPayment = async () => {
      const {payment_session_id, order_id} = await createOrder();

        let checkoutOptions = {
            paymentSessionId: payment_session_id,
            redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions).then(async (result) => {
            if(result.error){
                // console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
            }
            if(result.redirect){
                console.log("Payment will be redirected");
            }
            if(result.paymentDetails){
                // console.log("Payment has been completed, Check for Payment Status");
                await verifyPayment(order_id);
          
            }
        });
    };

    const verifyPayment = async (order_id) => {
      try {
        const response = await fetch(`http://localhost:5001/api/cashfree/verify-payment/${order_id}`);
        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }
    
        const data = await response.json();
        console.log("Verification Response:", data);
    
        if (data.orderStatus === "Success") {
          toast.success("Payment Successful!");
          paymentSuccess(data.payments[0]); // Call parent function to handle successful payment
        } else if (data.orderStatus === "Pending") {
          toast.error("Payment is pending. Please wait for confirmation.");
        } else {
          toast.error("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment. Please try again.");
      }
    };

  return (
    <div>
      <button
        onClick={doPayment}
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
