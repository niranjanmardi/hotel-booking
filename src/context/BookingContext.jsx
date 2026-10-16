import { createContext, useContext, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectHotel as reduxSelectHotel,
  selectRoom as reduxSelectRoom,
  updateDates as reduxUpdateDates,
  updateGuests as reduxUpdateGuests,
  updateGuest as reduxUpdateGuest,
  updatePayment as reduxUpdatePayment,
  clearBooking as reduxClearBooking,
  selectTotals,
  getNights
} from '../store/store';

/**
 * Context API: BookingContext & useBooking Custom Hook
 * Unit 3 Experiment 2 (b, c, d, e, f, g)
 */
export const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const dispatch = useDispatch();
  const booking = useSelector(state => state.booking);
  const totals = useSelector(selectTotals);

  // useCallback for stable reservation operations (Unit 3 Exp 1f, Exp 2f)
  const selectHotel = useCallback((hotel) => {
    dispatch(reduxSelectHotel(hotel));
  }, [dispatch]);

  const selectRoom = useCallback((room) => {
    dispatch(reduxSelectRoom(room));
  }, [dispatch]);

  const updateGuests = useCallback((count) => {
    dispatch(reduxUpdateGuests(count));
  }, [dispatch]);

  const updateDates = useCallback((dates) => {
    dispatch(reduxUpdateDates(dates));
  }, [dispatch]);

  const updateGuest = useCallback((guestInfo) => {
    dispatch(reduxUpdateGuest(guestInfo));
  }, [dispatch]);

  const updatePayment = useCallback((method) => {
    dispatch(reduxUpdatePayment(method));
  }, [dispatch]);

  const clearBooking = useCallback(() => {
    dispatch(reduxClearBooking());
  }, [dispatch]);

  // useMemo for calculated stay duration, taxes, fees, and final amount (Unit 3 Exp 2e)
  const calculated = useMemo(() => {
    const nights = getNights(booking.checkIn, booking.checkOut);
    const roomCost = (booking.room?.price || 0) * nights;
    const taxes = Math.round(roomCost * 0.12);
    const serviceFee = roomCost ? 499 : 0;
    const finalAmount = roomCost + taxes + serviceFee;
    return {
      nights,
      roomCost,
      taxes,
      serviceFee,
      finalAmount
    };
  }, [booking.checkIn, booking.checkOut, booking.room]);

  const value = {
    booking,
    totals,
    calculated,
    selectHotel,
    selectRoom,
    updateGuests,
    updateDates,
    updateGuest,
    updatePayment,
    clearBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
