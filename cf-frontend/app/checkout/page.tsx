import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/");
}

// CART_DISABLED: Original checkout page below
// import { AnnouncementBar, Header, Footer } from "@/components/layout";
// import { CategoryHero, CheckoutForm } from "@/components/sections";
// import CheckoutGuard from "@/components/checkout/CheckoutGuard";
//
// export default function CheckoutPage() {
//   return (
//     <main>
//       <AnnouncementBar />
//       <Header />
//       <CategoryHero
//         title="Checkout"
//         breadcrumbs={[
//           { label: "Home", href: "/" },
//           { label: "Checkout" },
//         ]}
//         backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
//       />
//       <section className="max-w-7xl mx-auto px-4 py-8">
//         <CheckoutGuard>
//           <CheckoutForm />
//         </CheckoutGuard>
//       </section>
//       <Footer />
//     </main>
//   );
// }
