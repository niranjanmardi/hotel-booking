import {render, screen, waitFor} from '@testing-library/react';
import BookingPage, {BookingGuest, BookingSummary, Checkout} from '../pages/Booking';
import AuthBookings, {Login, Bookings} from '../pages/AuthBookings';
import {store, clearBooking, selectHotel, selectRoom} from '../store/store';
import {Provider} from 'react-redux';
import {AuthProvider} from '../context/AuthContext';
import {MemoryRouter} from 'react-router-dom';

describe('App routes and page exports', () => {
  test('Booking components and default export exist and render empty state without crash', () => {
    expect(typeof BookingPage).toBe('function');
    expect(typeof BookingGuest).toBe('function');
    expect(typeof BookingSummary).toBe('function');
    expect(typeof Checkout).toBe('function');

    render(
      <Provider store={store}>
        <AuthProvider>
          <MemoryRouter initialEntries={['/booking/guest']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <BookingPage />
          </MemoryRouter>
        </AuthProvider>
      </Provider>
    );
    expect(screen.getByText(/Your booking is empty/i)).toBeInTheDocument();
  });

  test('AuthBookings components and default export exist and render', async () => {
    expect(typeof AuthBookings).toBe('function');
    expect(typeof Login).toBe('function');
    expect(typeof Bookings).toBe('function');

    render(
      <Provider store={store}>
        <AuthProvider>
          <MemoryRouter initialEntries={['/login']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthBookings />
          </MemoryRouter>
        </AuthProvider>
      </Provider>
    );
    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Create an account/i)).toBeInTheDocument();
  });

  test('clearBooking resets state to clean initial defaults', () => {
    store.dispatch(selectHotel({id: '101', name: 'Test'}));
    store.dispatch(selectRoom({id: 'room-1', name: 'Room'}));
    expect(store.getState().booking.hotel).not.toBeNull();
    expect(store.getState().booking.room).not.toBeNull();

    store.dispatch(clearBooking());
    expect(store.getState().booking.hotel).toBeNull();
    expect(store.getState().booking.room).toBeNull();
  });
});
