export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD").format(price);
}
