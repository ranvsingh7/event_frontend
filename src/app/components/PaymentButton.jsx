// import React, { useState } from "react";
// import { load } from "@cashfreepayments/cashfree-js";
// import toast from "react-hot-toast";

// const PaymentButton = ({ amount, paymentSuccess, customerData }) => {
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
//   let cashfree;
//     var initializeSDK = async function () {          
//         cashfree = await load({
//             mode: "production"
//         });
//     }
//     initializeSDK();


//     const createOrder = async () => {
//       try {
//         const response = await fetch(`${baseUrl}/api/cashfree/create-order`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             order_amount: amount,
//             customer_details: customerData,
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to create order");
//         }
  
//         const data = await response.json();
//         // console.log(data.data.order_id)
//         const id = {
//           payment_session_id:data.data.payment_session_id,
//           order_id: data.data.order_id
//         }
//         return id;
//       } catch (error) {
//         console.error("Error creating order:", error);
//         toast.error("Failed to initiate payment. Please try again.");
//         return null;
//       }
//     };

//     const doPayment = async () => {
//       const {payment_session_id, order_id} = await createOrder();

//         let checkoutOptions = {
//             paymentSessionId: payment_session_id,
//             redirectTarget: "_modal",
//         };
//         cashfree.checkout(checkoutOptions).then(async (result) => {
//             if(result.error){
//                 // console.log("User has closed the popup or there is some payment error, Check for Payment Status");
//                 console.log(result.error);
//             }
//             if(result.redirect){
//                 console.log("Payment will be redirected");
//             }
//             if(result.paymentDetails){
//                 // console.log("Payment has been completed, Check for Payment Status");
//                 await verifyPayment(order_id);
          
//             }
//         });
//     };

//     const verifyPayment = async (order_id) => {
//       try {
//         const response = await fetch(`${baseUrl}/api/cashfree/verify-payment/${order_id}`);
//         if (!response.ok) {
//           throw new Error("Failed to verify payment");
//         }
    
//         const data = await response.json();
//         console.log("Verification Response:", data);
    
//         if (data.orderStatus === "Success") {
//           toast.success("Payment Successful!");
//           paymentSuccess(data.payments[0]); // Call parent function to handle successful payment
//         } else if (data.orderStatus === "Pending") {
//           toast.error("Payment is pending. Please wait for confirmation.");
//         } else {
//           toast.error("Payment failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error verifying payment:", error);
//         toast.error("Failed to verify payment. Please try again.");
//       }
//     };

//   return (
//     <div>
//       <button
//         onClick={doPayment}
//         disabled={amount <= 0}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: amount > 0 ? "#3399cc" : "#cccccc",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: amount > 0 ? "pointer" : "not-allowed",
//         }}
//       >
//         Pay ₹{amount}
//       </button>
//     </div>
//   );
// };

// export default PaymentButton;


import React, { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";

const PaymentButton = ({ amount, paymentSuccess, customerData }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ SDK initialize correctly (ONLY ONCE)
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cf = await load({
          mode: "production", // change to "sandbox" if testing
        });
        setCashfree(cf);
      } catch (err) {
        console.error("SDK Load Error:", err);
        toast.error("Payment SDK failed to load");
      }
    };

    initializeSDK();
  }, []);

  // ✅ Create Order API
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

      // 🔍 Debug (optional)
      console.log("Order Response:", data);

      if (!data?.data?.payment_session_id) {
        throw new Error("Invalid payment session");
      }

      return {
        payment_session_id: data.data.payment_session_id,
        order_id: data.data.order_id,
      };
    } catch (error) {
      console.error("Create Order Error:", error);
      toast.error("Failed to initiate payment");
      return null;
    }
  };

  // ✅ Verify Payment
  const verifyPayment = async (order_id) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/cashfree/verify-payment/${order_id}`
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const data = await response.json();
      console.log("Verification Response:", data);

      if (data.orderStatus === "Success") {
        toast.success("Payment Successful!");
        paymentSuccess(data.payments?.[0]);
      } else if (data.orderStatus === "Pending") {
        toast("Payment pending, please wait...");
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error("Payment verification failed");
    }
  };

  // ✅ Main Payment Function
  const doPayment = async () => {
    if (!cashfree) {
      toast.error("Payment system not ready");
      return;
    }

    if (amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);

    try {
      const orderData = await createOrder();
      if (!orderData) return;

      const { payment_session_id, order_id } = orderData;

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      };

      const result = await cashfree.checkout(checkoutOptions);

      console.log("Checkout Result:", result);

      if (result.error) {
        console.log(result.error);
        toast.error("Payment failed or cancelled");
      }

      if (result.redirect) {
        console.log("User redirected");
      }

      if (result.paymentDetails) {
        await verifyPayment(order_id);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={doPayment}
      disabled={amount <= 0 || loading || !cashfree}
      style={{
        padding: "10px 20px",
        backgroundColor: amount > 0 ? "#3399cc" : "#cccccc",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: amount > 0 ? "pointer" : "not-allowed",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
};

export default PaymentButton;