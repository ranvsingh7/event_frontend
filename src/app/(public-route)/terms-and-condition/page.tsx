"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const TermsAndConditions = () => {
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
          <h1 className="text-4xl font-extrabold mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-300">Last updated on 10-03-2025 17:19:54</p>
        </div>

        <div className="space-y-6">
          <p className="text-gray-300">
            These Terms and Conditions, along with the privacy policy or other terms (“Terms”), constitute a binding
            agreement by and between RANVEER (“Website Owner” or “we” or “us” or “our”) and you (“you” or “your”) and
            relate to your use of our website, goods (as applicable), or services (as applicable) (collectively, “Services”).
          </p>

          <p className="text-gray-300">
            By using our website and availing of the Services, you agree that you have read and accepted these Terms
            (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning
            any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
          </p>

          <h2 className="text-xl font-semibold text-gray-200">Terms of Use:</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              To access and use the Services, you agree to provide true, accurate, and complete information to us during
              and after registration, and you shall be responsible for all acts done through the use of your registered account.
            </li>
            <li>
              Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance,
              completeness, or suitability of the information and materials offered on this website or through the Services,
              for any specific purpose.
            </li>
            <li>
              Your use of our Services and the website is solely at your own risk and discretion. You are required to
              independently assess and ensure that the Services meet your requirements.
            </li>
            <li>
              The contents of the Website and the Services are proprietary to us, and you will not have any authority to
              claim any intellectual property rights, title, or interest in its contents.
            </li>
            <li>
              Unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.
            </li>
            <li>You agree to pay us the charges associated with availing the Services.</li>
            <li>
              You agree not to use the website and/or Services for any purpose that is unlawful, illegal, or forbidden
              by these Terms or Indian or local laws that might apply to you.
            </li>
            <li>
              You acknowledge that the website and the Services may contain links to other third-party websites.
              On accessing these links, you will be governed by the terms of use and policies of such third-party websites.
            </li>
            <li>
              You understand that upon initiating a transaction for availing of the Services, you are entering into a legally
              binding contract with us.
            </li>
            <li>
              You shall be entitled to claim a refund if we are not able to provide the Service. Refund timelines will be
              according to our policies (as applicable).
            </li>
            <li>
              Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform
              an obligation due to a force majeure event.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-200">Governing Law and Dispute Resolution:</h2>
          <p className="text-gray-300">
            These Terms and any dispute shall be governed by the laws of India. All disputes shall be subject to the
            exclusive jurisdiction of the courts in Jodhpur, Rajasthan.
          </p>

          <h2 className="text-xl font-semibold text-gray-200">Contact Us:</h2>
          <p className="text-gray-300">
            All concerns or communications relating to these Terms must be communicated to us using the contact
            information provided on this website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
