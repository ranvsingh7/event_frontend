"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const RefundAndCancellation = () => {
  const router = useRouter(); // Next.js App Router navigation hook

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6">
        <button
          onClick={() => router.back()} // Use Next.js App Router's back method
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md shadow-md hover:bg-yellow-500 transition-all duration-300"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2">Cancellation & Refund Policy</h1>
          <p className="text-sm text-gray-300">Last updated on 10-03-2025 17:20:17</p>
        </div>

        <div className="space-y-6">
          <p className="text-gray-300">
            RANVEER believes in helping its customers as far as possible and has therefore a liberal cancellation policy.
            Under this policy:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Cancellations will be considered only if the request is made immediately after placing the order. However,
              the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants
              and they have initiated the process of shipping them.
            </li>
            <li>
              RANVEER does not accept cancellation requests for perishable items like flowers, eatables, etc. However,
              refund/replacement can be made if the customer establishes that the quality of the product delivered is not good.
            </li>
            <li>
              In case of receipt of damaged or defective items, please report the same to our Customer Service team. The
              request will, however, be entertained once the merchant has checked and determined the same at their own end.
              This should be reported within 7 days of receipt of the products.
            </li>
            <li>
              In case you feel that the product received is not as shown on the site or as per your expectations, you must
              bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team,
              after looking into your complaint, will take an appropriate decision.
            </li>
            <li>
              In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue
              to them.
            </li>
            <li>
              In case of any refunds approved by RANVEER, it will take 6-8 days for the refund to be processed to the end customer.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundAndCancellation;
