export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(priceCents: number): string {
  return `Rs ${(priceCents / 100).toLocaleString()}`;
}
