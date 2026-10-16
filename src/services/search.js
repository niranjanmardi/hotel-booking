export function filterHotels(hotels, {search = '', rating = 'all', maxPrice = Infinity} = {}) {
  const term = search.trim().toLowerCase();
  const minimumRating = rating === 'all' ? 0 : Number(rating);
  return hotels.filter(hotel =>
    `${hotel.name} ${hotel.location} ${hotel.city}`.toLowerCase().includes(term) &&
    hotel.rating >= minimumRating &&
    hotel.priceFrom <= Number(maxPrice)
  );
}
