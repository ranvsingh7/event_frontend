import React, { useState } from "react";
import {load} from "@cashfreepayments/cashfree-js"
import axios from "axios";

const PaymentButton = ({ amount, paymentSuccess, customerData}) => {
  let cashfree;

  let insitialzeSDK = async function () {
    const mode = process.env.NODE_ENV === "development" ? "sandbox" : "production";
    cashfree = await load({
      mode: mode,
    })
  }

  insitialzeSDK()

  const [orderId, setOrderId] = useState("")



  const getSessionId = async () => {
    console.log(amount)
    try {
      const queryParams = new URLSearchParams({
        amount: amount,
        customer_name: customerData.customer_name,
        customer_email: customerData.customer_email,
        customer_phone: customerData.customer_phone,
        customer_id: customerData.customer_id,
      })

      const res = await axios.get(`http://localhost:5001/api/cashfree/payment?${queryParams}`);
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return {
          payment_session_id: res.data.payment_session_id,
          order_id: res.data.order_id,
        };
      }
    } catch (error) {
      console.log(error)
    }
  }

  const verifyPayment = async (order_id) => {
    console.log(orderId)
    try {
      
      let res = await axios.post("http://localhost:5001/api/cashfree/verify", {
        orderId: order_id
      })

      if(res && res.data){
        paymentSuccess(res.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    try {

      let sessionId = await getSessionId()
      const {payment_session_id, order_id} = sessionId

      let checkoutOptions = {
        paymentSessionId : payment_session_id,
        redirectTarget:"_modal",
      }

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized")
        verifyPayment(order_id)
      })


    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
    <button
      onClick={handlePayment}
      disabled={amount<=0}
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
