import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 my-12 border-[1px] border-border bg-surface text-foreground">
      <h1 className="text-4xl font-bold uppercase tracking-tight mb-8" style={{ fontFamily: "var(--font-space-grotesk)" }}>Terms of Service</h1>
      
      <div className="flex flex-col gap-6 text-gray-400">
        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CampusOne, you agree to be bound by these Terms of Service. This platform provides intelligent orchestration of university knowledge and support services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">2. User Responsibilities</h2>
          <p>
            You must use CampusOne strictly for academic and administrative inquiries related to your enrolled institution. Misuse of the platform, including prompt injection, unauthorized data access attempts, or abuse of the ticketing system, will result in account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">3. Service Limitations</h2>
          <p>
            While CampusOne provides grounded answers with citations, final authority on deadlines, fees, and policies rests with the official university departments. The system will hand off requests to human agents when confidence thresholds are not met.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">4. Disclaimers</h2>
          <p>
            CampusOne is provided "as is" without warranty of any kind. The university is not liable for indirect damages or missed deadlines arising from the use of this service.
          </p>
        </section>
      </div>
    </div>
  );
}
