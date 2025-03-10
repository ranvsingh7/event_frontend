import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated on 10-03-2025 17:19:54</p>

        <div className="space-y-4">
          <p>
            These Terms and Conditions, along with the privacy policy or other terms (“Terms”), constitute a binding
            agreement by and between RANVEER (“Website Owner” or “we” or “us” or “our”) and you (“you” or “your”) and
            relate to your use of our website, goods (as applicable), or services (as applicable) (collectively, “Services”).
          </p>

          <p>
            By using our website and availing of the Services, you agree that you have read and accepted these Terms
            (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning
            any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Terms of Use:</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              To access and use the Services, you agree to provide true, accurate, and complete information to us during
              and after registration, and you shall be responsible for all acts done through the use of your registered account.
            </li>
            <li>
              Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance,
              completeness, or suitability of the information and materials offered on this website or through the Services,
              for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or
              errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
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
              You acknowledge that unauthorized use of the Website or the Services may lead to action against you as
              per these Terms or applicable laws.
            </li>
            <li>You agree to pay us the charges associated with availing the Services.</li>
            <li>
              You agree not to use the website and/or Services for any purpose that is unlawful, illegal, or forbidden
              by these Terms or Indian or local laws that might apply to you.
            </li>
            <li>
              You agree and acknowledge that the website and the Services may contain links to other third-party websites.
              On accessing these links, you will be governed by the terms of use, privacy policy, and such other policies
              of such third-party websites.
            </li>
            <li>
              You understand that upon initiating a transaction for availing of the Services, you are entering into a legally
              binding and enforceable contract with us for the Services.
            </li>
            <li>
              You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the
              Service. The timelines for such return and refund will be according to the specific Service you have availed
              or within the time period provided in our policies (as applicable). In case you do not raise a refund claim
              within the stipulated time, then this would make you ineligible for a refund.
            </li>
            <li>
              Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform
              an obligation under these Terms if performance is prevented or delayed by a force majeure event.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-700">Governing Law and Dispute Resolution:</h2>
          <p className="text-gray-600">
            These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed
            in accordance with the laws of India. All disputes arising out of or in connection with these Terms shall be
            subject to the exclusive jurisdiction of the courts in Jodhpur, Rajasthan.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Contact Us:</h2>
          <p className="text-gray-600">
            All concerns or communications relating to these Terms must be communicated to us using the contact
            information provided on this website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
