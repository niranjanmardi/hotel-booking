import {getNights, selectTotals} from './store';

describe('booking cost calculations', () => {
  test('calculates the number of nights', () => {
    expect(getNights('2026-11-12', '2026-11-15')).toBe(3);
    expect(getNights('2026-11-15', '2026-11-15')).toBe(1);
  });
  test('calculates room cost, taxes, service fee, and total', () => {
    const totals = selectTotals({booking: {checkIn: '2026-11-12', checkOut: '2026-11-15', room: {price: 6800}}});
    expect(totals).toEqual({nights: 3, roomCost: 20400, taxes: 2448, serviceFee: 499, total: 23347});
  });
});
