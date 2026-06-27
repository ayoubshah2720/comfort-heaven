import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";
import type { Metadata } from "next";
import { SITE_NAME, STORE_FULL_ADDRESS, STORE_PHONE_DISPLAY } from "@/constants";

export const metadata: Metadata = {
  title: `Replacement & Retrieval Policy | ${SITE_NAME}`,
  description: `Understand our replacement, return, and retrieval policy for furniture purchased from ${SITE_NAME} in Pakistan.`,
};

export default function ReplacementAndRetrievalPolicyPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Replacement & Retrieval Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Replacement & Retrieval Policy" },
        ]}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <p className="text-gray-500 text-sm">Last updated: March 2026</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Replacement Window</h2>
          <p className="text-gray-700 leading-relaxed">
            You may request a replacement within <strong>7 days</strong> of delivery if the product arrives damaged,
            defective, or significantly different from what was described on our website. Claims filed after 7 days will
            not be eligible for replacement.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. Eligible Conditions</h2>
          <p className="text-gray-700 leading-relaxed">A replacement or retrieval may be approved in the following cases:</p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li><strong>Damage during delivery:</strong> Visible structural damage, broken parts, or scratches that occurred during transit.</li>
            <li><strong>Manufacturing defects:</strong> Faulty joints, uneven surfaces, broken mechanisms, or material defects not caused by use.</li>
            <li><strong>Wrong item delivered:</strong> You received a product different from what you ordered.</li>
            <li><strong>Missing components:</strong> Hardware, cushions, or assembly parts missing from the package.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. How to File a Claim</h2>
          <ol className="list-decimal pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Contact our support team at <strong>{STORE_PHONE_DISPLAY}</strong> within 7 days of receiving your order.</li>
            <li>Provide your order number and a clear description of the issue.</li>
            <li>Share photographs of the damage or defect for our team to assess.</li>
            <li>Our team will review your claim within 2-3 business days and inform you of the outcome.</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. Retrieval Process</h2>
          <p className="text-gray-700 leading-relaxed">
            If your claim is approved, our logistics team will arrange a pickup of the affected item at no additional cost.
            For deliveries within Bahawalpur, retrieval is typically completed within 3-5 business days. For other cities
            in Pakistan, retrieval may take 7-10 business days.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">5. Exclusions</h2>
          <p className="text-gray-700 leading-relaxed">The following are <strong>not</strong> eligible for replacement or retrieval:</p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Damage caused by misuse, improper assembly, or negligence after delivery.</li>
            <li>Normal wear and tear, including minor colour variations in natural wood or fabric.</li>
            <li>Products that have been modified, repaired, or altered by the customer.</li>
            <li>Items purchased during clearance or final-sale events (unless defective).</li>
            <li>Claims filed after the 7-day replacement window has expired.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">6. Refund Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            If a suitable replacement is not available, we will issue a full refund to your original payment method.
            Refunds for bank transfers and online payments are processed within 7-10 business days. For cash-on-delivery
            orders, a refund will be issued via bank transfer to your provided account details.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">7. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For any questions regarding replacements or retrievals, please reach out to us:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li><strong>Phone:</strong> {STORE_PHONE_DISPLAY}</li>
            <li><strong>Address:</strong> {STORE_FULL_ADDRESS}</li>
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
