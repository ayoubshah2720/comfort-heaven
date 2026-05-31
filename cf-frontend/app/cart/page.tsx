import { redirect } from "next/navigation";

export default function CartPage() {
  redirect("/");
}

// CART_DISABLED: Original cart page below
// import { AnnouncementBar, Header, Footer } from "@/components/layout";
// import { CategoryHero, CartTable, CartSummary } from "@/components/sections";
//
// export default function CartPage() {
//   return (
//     <main>
//       <AnnouncementBar />
//       <Header />
//       <CategoryHero
//         title="Shopping Cart"
//         breadcrumbs={[
//           { label: "Home", href: "/" },
//           { label: "Shopping Cart" },
//         ]}
//         backgroundImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80"
//       />
//       <section className="max-w-4xl mx-auto px-4 py-8">
//         <CartTable />
//         <CartSummary />
//       </section>
//       <Footer />
//     </main>
//   );
// }
