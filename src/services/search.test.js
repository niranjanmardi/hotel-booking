import {filterHotels} from './search';
import {hotels} from '../data/hotels';

test('filters hotels by location, rating, and price', () => {
  const result = filterHotels(hotels, {search: 'goa', rating: '4.8', maxPrice: 7000});
  expect(result.map(hotel => hotel.name)).toEqual(['The Fern House']);
});
