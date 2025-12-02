export function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (!numPrice && numPrice !== 0) {
    return 'Precio no disponible';
  }
  
  if (numPrice === 0) {
    return 'Gratis';
  }
  
  return `${numPrice}€`;
}

export function isPriceAvailable(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice !== null && numPrice !== undefined;
}