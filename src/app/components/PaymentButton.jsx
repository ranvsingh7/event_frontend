import React, { useState } from "react";
import {load} from "@cashfreepayments/cashfree-js"
import axios from "axios";

const PaymentButton = ({ amount, paymentSuccess}) => {
  let cashfree;

  let insitialzeSDK = async function () {

    cashfree = await load({
      mode: "production",
    })
  }

  insitialzeSDK()

  const [orderId, setOrderId] = useState("")



  const getSessionId = async () => {
    try {
      let res = await axios.get("http://localhost:5001/api/cashfree/payment")
      
      if(res.data && res.data.payment_session_id){

        console.log(res.data)
        setOrderId(res.data.order_id)
        return res.data.payment_session_id
      }


    } catch (error) {
      console.log(error)
    }
  }

  const verifyPayment = async () => {
    try {
      
      let res = await axios.post("http://localhost:5001/api/cashfree/verify", {
        orderId: orderId
      })

      if(res && res.data){
        alert("payment verified")
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    try {

      let sessionId = await getSessionId()
      let checkoutOptions = {
        paymentSessionId : sessionId,
        redirectTarget:"_modal",
      }

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized")

        verifyPayment(orderId)
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
