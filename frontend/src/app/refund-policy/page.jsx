import Navbar from "@/components/common/navbar";


export default function RefundPolicyPage() {
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
              Refund Policy
            </h1>

            <p className="text-gray-500 mt-4">Last updated: 2026</p>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                1. No Refund After Ticket Purchase
              </h2>
              <p>
                All ticket purchases at Ice Dome Cambodia are final. Once a
                ticket has been purchased and payment has been completed, the
                ticket is non-refundable.
              </p>
              <p className="mt-3 font-semibold text-red-600">
                Please check your selected date, session time, ticket type, and
                quantity carefully before confirming your payment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                2. Customer Responsibility
              </h2>
              <p>
                Customers are responsible for reviewing all booking details
                before completing payment. Ice Dome Cambodia is not responsible
                for incorrect date selection, wrong session time, wrong ticket
                type, duplicate purchase, or customer schedule changes after the
                ticket has been bought.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                3. Unused Tickets
              </h2>
              <p>
                If a customer does not attend the selected skating session, the
                ticket will be considered unused. Unused tickets are not
                refundable after purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                4. Late Arrival
              </h2>
              <p>
                Customers are encouraged to arrive on time for their selected
                session. Late arrival does not guarantee extended skating time
                and does not qualify for a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                5. Rescheduling
              </h2>
              <p>
                Ice Dome Cambodia may allow rescheduling only in special cases
                and only when approved by the company. Rescheduling is not
                guaranteed and depends on availability, booking status, and
                company policy.
              </p>
              <p className="mt-3">
                Approved rescheduling does not mean the ticket is refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                6. Cancelled Sessions by Ice Dome Cambodia
              </h2>
              <p>
                If Ice Dome Cambodia cancels a session due to maintenance,
                safety concerns, private events, or operational issues, the
                company may offer rescheduling, replacement session, credit, or
                another solution based on company decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                7. Payment Errors
              </h2>
              <p>
                If you believe you were charged incorrectly because of a payment
                system error, please contact Ice Dome Cambodia support with your
                transaction reference, booking ID, payment screenshot, and
                account email. The company will review the case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                8. Shop Orders
              </h2>
              <p>
                This refund policy mainly applies to skating ticket purchases.
                Refunds, exchanges, or returns for shop products may follow
                separate product return rules depending on product condition,
                availability, and company approval.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                9. Contact Support
              </h2>
              <p>
                For questions about this Refund Policy, please contact Ice Dome
                Cambodia through our contact page or customer support email.
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-2xl bg-red-50 border border-red-100 p-5 text-sm text-red-800">
            <p className="font-bold mb-1">Important Notice</p>
            <p>
              Ice Dome Cambodia does not provide refunds after a ticket has been
              bought. Please confirm all booking details before payment.
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}