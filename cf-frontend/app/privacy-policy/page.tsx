import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Comfort Heaven",
  description:
    "Learn how Comfort Heaven collects, uses, and protects your personal information when you shop for furniture online in Pakistan.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <p className="text-gray-500 text-sm">Last updated: March 2026</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            When you use Comfort Heaven, we may collect the following types of personal information:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Name, email address, phone number, and shipping address when you create an account or place an order.</li>
            <li>Payment information processed securely through our third-party payment partners.</li>
            <li>Browsing behaviour, device information, and IP address collected automatically through cookies and similar technologies.</li>
            <li>Any information you voluntarily provide when contacting our customer support.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Process and fulfil your orders, including delivery within Pakistan.</li>
            <li>Communicate with you about your orders, account, and promotional offers.</li>
            <li>Improve our website, products, and customer service.</li>
            <li>Prevent fraud and ensure the security of our platform.</li>
            <li>Comply with legal obligations under Pakistani law, including the Prevention of Electronic Crimes Act (PECA) 2016.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. Cookies &amp; Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences,
            and analyse site traffic. You may disable cookies in your browser settings, but doing so may affect certain
            features of our website.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. Third-Party Sharing</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell your personal information. We may share your data with trusted third parties solely for the
            purpose of:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Payment processing and fraud prevention.</li>
            <li>Order delivery and logistics within Pakistan.</li>
            <li>Analytics services to help us understand website usage.</li>
            <li>Legal compliance when required by Pakistani authorities.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">5. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information for as long as your account is active or as needed to provide you with our
            services. We may also retain certain data as required by law or for legitimate business purposes such as
            resolving disputes and enforcing our agreements.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Withdraw consent for marketing communications at any time.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To exercise any of these rights, please contact us at <strong>062-2502660</strong> or visit our store at
            Innovation Heights Complex, Bahawalpur.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">7. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
            revision date. We encourage you to review this policy periodically.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
