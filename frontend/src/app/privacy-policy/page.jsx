import Navbar from "@/components/common/navbar";


export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-6 pt-32 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">
              Ice Dome Cambodia
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Privacy Policy
            </h1>

            <p className="text-gray-500 mt-4">
              Last updated: 2026
            </p>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                1. Introduction
              </h2>
              <p>
                This Privacy Policy explains how Ice Dome Cambodia collects,
                uses, stores, and protects your personal information when you
                use our website, create an account, book tickets, purchase
                products, or contact our support team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                2. Information We Collect
              </h2>
              <p>
                We may collect information such as your full name, email
                address, phone number, account login details, booking
                information, order details, payment status, and communication
                history with our team.
              </p>
              <p className="mt-3">
                We may also collect technical information such as browser type,
                device information, IP address, and website usage activity to
                help improve website performance and security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                3. How We Use Your Information
              </h2>
              <p>
                We use your information to create and manage your account,
                process ticket bookings, manage shop orders, confirm payments,
                provide customer support, send booking updates, improve our
                services, and protect our website from fraud or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                4. Booking and Ticket Information
              </h2>
              <p>
                When you book a skating session, we store booking details such
                as ticket type, quantity, selected date, selected session,
                booking status, payment status, and QR ticket information. This
                information is used to verify your entry at Ice Dome Cambodia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                5. Payment Information
              </h2>
              <p>
                Payments may be processed through third-party payment providers
                or banking services. We do not store full card numbers or
                sensitive banking credentials on our website. We may store
                payment status, transaction reference, invoice details, and
                related booking information for confirmation and support
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                6. Cookies and Website Tracking
              </h2>
              <p>
                Our website may use cookies or similar technologies to remember
                login sessions, improve user experience, analyze website usage,
                and protect against suspicious activity. You may disable cookies
                in your browser, but some website features may not work properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                7. Sharing Your Information
              </h2>
              <p>
                We do not sell your personal information. We may share necessary
                information with trusted service providers such as payment
                processors, hosting providers, support tools, or legal
                authorities when required by law or necessary to operate our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                8. Data Security
              </h2>
              <p>
                We take reasonable security measures to protect your personal
                information, including password protection, secure server
                practices, access control, and encrypted payment processing
                through third-party providers. However, no online platform can
                guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                9. Your Account Responsibilities
              </h2>
              <p>
                You are responsible for keeping your account password private.
                If you believe your account has been accessed without
                permission, please contact us as soon as possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                10. Your Rights
              </h2>
              <p>
                You may request to review, update, or delete your personal
                information, subject to business, legal, and security
                requirements. Some booking or payment records may need to be
                retained for accounting, dispute resolution, or legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                11. Children’s Privacy
              </h2>
              <p>
                Ice skating activities may involve children, but online accounts
                and bookings should be managed by a parent, guardian, or
                responsible adult when required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                12. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Updates
                will be posted on this page with a revised “Last updated” date.
                Continued use of our website means you accept the updated
                policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                13. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy or your personal
                data, please contact Ice Dome Cambodia through our contact page
                or customer support email.
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-5 text-sm text-blue-900">
            <p className="font-bold mb-1">Note</p>
            <p>
              This page is a website policy template. Before launching for a
              real company, review it with the business owner or legal advisor.
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}