"use client"
import React from 'react'
import PaymentButton from '../components/PaymentButton'

const page = () => {
  return (
    <div>test
      <PaymentButton amount={10000} paymentSuccess={()=>{console.log("success")}} />
    </div>
  )
}

export default page