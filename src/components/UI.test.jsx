import {render, screen, fireEvent} from '@testing-library/react';
import {HotelCard} from './UI';

const hotel = {name:'Test Hotel', location:'Goa, India', rating:4.8, image:'/test.jpg', description:'A calm stay.', amenities:['Pool','Wi-Fi','Breakfast'], priceFrom:6800};

describe('hotel booking components', () => {
  test('renders a hotel card and selects it', () => {
    const onSelect = jest.fn();
    render(<HotelCard hotel={hotel} onSelect={onSelect}/>);
    expect(screen.getByRole('heading', {name:'Test Hotel'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name:/view details for test hotel/i}));
    expect(onSelect).toHaveBeenCalledWith(hotel);
  });
  test('shows an accessible image description', () => {
    render(<HotelCard hotel={hotel} onSelect={() => {}}/>);
    expect(screen.getByRole('img', {name:'Test Hotel'})).toBeInTheDocument();
  });
});
