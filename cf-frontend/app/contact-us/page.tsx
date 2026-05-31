import { AnnouncementBar, Header, Footer } from "@/components/layout";
import { CategoryHero } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Comfort Heaven",
  description:
    "Get in touch with Comfort Heaven for furniture inquiries, orders, and support. Located in Bahawalpur, Pakistan.",
};

export default function ContactUsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />
      <CategoryHero
        title="Contact Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Phone */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E8B800]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8B800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Phone</h2>
            <p className="text-gray-700 text-lg">062-2502660</p>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3D6B6B]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3D6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Address</h2>
            <p className="text-gray-700 text-lg">Innovation Heights Complex, Bahawalpur</p>
          </div>

          {/* Business Hours */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E8B800]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8B800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Business Hours</h2>
            <p className="text-gray-700">Monday &ndash; Saturday: 10:00 AM &ndash; 8:00 PM</p>
            <p className="text-gray-500 text-sm mt-1">Closed on Sundays</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
