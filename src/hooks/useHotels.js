import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiRequest } from '../services/api';
import { filterHotels } from '../services/search';

/**
 * Custom Hook: useHotels (Unit 3 Experiment 2a)
 * Manages hotel data fetching, search filters, rating filters, price limits, and amenities.
 */
export function useHotels(initialSearch = '') {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(initialSearch);
  const [rating, setRating] = useState('all');
  const [maxPrice, setMaxPrice] = useState(16000);
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/hotels');
      setHotels(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // useMemo for efficient filtered hotel computation (Unit 3 Exp 1e, Exp 2e)
  const filteredHotels = useMemo(() => {
    let list = filterHotels(hotels, { search, rating, maxPrice });
    if (selectedAmenity !== 'all') {
      list = list.filter(h => h.amenities?.includes(selectedAmenity));
    }
    return list;
  }, [hotels, search, rating, maxPrice, selectedAmenity]);

  return {
    hotels,
    filteredHotels,
    loading,
    error,
    search,
    setSearch,
    rating,
    setRating,
    maxPrice,
    setMaxPrice,
    selectedAmenity,
    setSelectedAmenity,
    refetch: fetchHotels
  };
}
