import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 my-12 border-[1px] border-border bg-surface text-foreground">
      <h1 className="text-4xl font-bold uppercase tracking-tight mb-8" style={{ fontFamily: "var(--font-space-grotesk)" }}>Privacy Policy</h1>
      
      <div className="flex flex-col gap-6 text-gray-400">
        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">1. Data Collection</h2>
          <p>
            CampusOne collects conversation transcripts, routing confidence scores, and user intent data to resolve academic inquiries and improve the routing architecture. Authentication is handled via university SSO, and we collect only the minimal personal data required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">2. Data Usage & AI Governance</h2>
          <p>
            Private student conversations are NOT used to train base foundation models. Data is strictly utilized for routing analytics, knowledge gap detection, and human agent handoff context.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">3. Role-Based Access</h2>
          <p>
            Your sensitive records (fees, disciplinary data, health) are protected by a strict permission matrix. The language model never determines data access permissions; all authorization occurs at the external API layer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">4. Retention and Deletion</h2>
          <p>
            Conversation logs are retained in accordance with institutional policy to ensure support continuity. Users may request anonymization or deletion of data subject to administrative retention requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
