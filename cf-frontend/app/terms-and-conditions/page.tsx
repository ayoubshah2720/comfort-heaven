import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";
import type { Metadata } from "next";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Read the terms and conditions governing the use of ${SITE_NAME}, your trusted online furniture store in Pakistan.`,
};

export default function TermsAndConditionsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Terms & Conditions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <p className="text-gray-500 text-sm">Last updated: March 2026</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Account Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By creating an account on {SITE_NAME}, you agree to provide accurate, current, and complete information.
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that
            occur under your account.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. Ordering &amp; Pricing</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>All prices are listed in Pakistani Rupees (Rs.) and include applicable taxes unless stated otherwise.</li>
            <li>We reserve the right to modify prices at any time without prior notice. However, price changes will not affect orders that have already been confirmed.</li>
            <li>An order is considered confirmed once you receive an order confirmation via email or SMS.</li>
            <li>We reserve the right to cancel any order if the product is unavailable, there is a pricing error, or we suspect fraudulent activity.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. Payment</h2>
          <p className="text-gray-700 leading-relaxed">
            We accept payments via bank transfer, cash on delivery (COD), and supported online payment methods.
            All online payments are processed through secure, PCI-compliant third-party payment gateways. {SITE_NAME}
            does not store your credit or debit card information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. Shipping &amp; Delivery</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>We deliver furniture across Pakistan. Delivery timelines vary based on your location and product availability.</li>
            <li>Standard delivery within Bahawalpur is typically completed within 3-5 business days. Deliveries to other cities may take 7-14 business days.</li>
            <li>Shipping charges, if applicable, will be displayed at checkout before you confirm your order.</li>
            <li>Risk of loss or damage transfers to you upon delivery. Please inspect your furniture at the time of delivery and report any issues immediately.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content on this website &mdash; including text, images, logos, product designs, and graphics &mdash; is the
            property of {SITE_NAME} and is protected under Pakistani intellectual property laws. You may not reproduce,
            distribute, or use any content from this site without our prior written consent.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by Pakistani law, {SITE_NAME} shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of our website or products. Our total
            liability for any claim shall not exceed the amount you paid for the product in question.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">7. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These terms and conditions are governed by the laws of Pakistan. Any disputes arising from these terms shall be
            subject to the exclusive jurisdiction of the courts in Bahawalpur, Punjab, Pakistan.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">8. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to update these Terms &amp; Conditions at any time. Changes will be posted on this page
            with a revised date. Continued use of the website after changes are posted constitutes acceptance of the new
            terms.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
