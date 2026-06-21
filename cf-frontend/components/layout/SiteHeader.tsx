import Header from "./Header";
import { getHeaderCategories } from "@/lib/storefront-api";

export default async function SiteHeader() {
  const initialCategories = await getHeaderCategories();
  return <Header initialCategories={initialCategories} />;
}
