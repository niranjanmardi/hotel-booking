import {apiRequest, clearApiCache} from './api';

describe('hotel REST-style API', () => {
  beforeEach(() => { localStorage.clear(); clearApiCache(); });
  test('returns hotels for GET /hotels and caches the response', async () => {
    const first = await apiRequest('/hotels');
    const second = await apiRequest('/hotels');
    expect(first.data.length).toBeGreaterThan(0);
    expect(second.data).toBe(first.data);
  });
  test('returns individual hotel details for a dynamic GET route', async () => {
    const response = await apiRequest('/hotels/101');
    expect(response.data.name).toBe('The Fern House');
    await expect(apiRequest('/hotels/999')).rejects.toThrow('Hotel not found');
  });
  test('supports reservation POST, PATCH, GET and DELETE', async () => {
    const created = await apiRequest('/reservations', {method:'POST', body:{hotelName:'Test Hotel', total:1200}});
    expect(created.data.status).toBe('Confirmed');
    const updated = await apiRequest(`/reservations/${created.data.id}`, {method:'PATCH', body:{guestName:'Aarav'}});
    expect(updated.data.guestName).toBe('Aarav');
    expect((await apiRequest('/reservations')).data).toHaveLength(1);
    await apiRequest(`/reservations/${created.data.id}`, {method:'DELETE'});
    expect((await apiRequest('/reservations')).data).toHaveLength(0);
  });
});
