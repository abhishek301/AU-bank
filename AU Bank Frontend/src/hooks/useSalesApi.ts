import { useState, useEffect, useCallback } from 'react';
import { salesApi } from '../services/salesApi';
import type { Sale, DateRange, SalesStats, SalesFilters, SalesByCityItem } from '../types/api';

// Hook for loading states
export const useStates = () => {
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.getStates();
      setStates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch states');
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return { states, loading, error, refetch: fetchStates };
};

// Hook for date range
export const useDateRange = (state: string) => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDateRange = useCallback(async (selectedState: string) => {
    if (!selectedState.trim()) {
      setDateRange(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.getDateRangeForState(selectedState);
      setDateRange(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch date range');
      setDateRange(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDateRange(state);
  }, [state, fetchDateRange]);

  return { dateRange, loading, error, refetch: () => fetchDateRange(state) };
};

// Hook for sales data with filters
export const useSalesData = (filters: SalesFilters = {}) => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = useCallback(async (currentFilters: SalesFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await salesApi.getSalesData(currentFilters);
      
      setSalesData(result.data);
      setPagination({
        current: result.page,
        total: result.total,
        pageSize: result.limit,
        totalPages: result.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesData(filters);
  }, [filters, fetchSalesData]);

  return { 
    salesData, 
    pagination, 
    loading, 
    error, 
    refetch: () => fetchSalesData(filters) 
  };
};

// Hook for statistics
export const useStats = (filters?: { state?: string; startDate?: string; endDate?: string }) => {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (currentFilters?: { state?: string; startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.getStats(currentFilters);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(filters);
  }, [filters, fetchStats]);

  return { stats, loading, error, refetch: () => fetchStats(filters) };
};

export const useSalesByCity = (filters?: { state?: string; startDate?: string; endDate?: string }) => {
  const [data, setData] = useState<SalesByCityItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesByCity = useCallback(
    async (currentFilters?: { state?: string; startDate?: string; endDate?: string }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await salesApi.getSalesByCity(currentFilters);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sales by city');
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSalesByCity(filters);
  }, [filters, fetchSalesByCity]);

  return { data, loading, error, refetch: () => fetchSalesByCity(filters) };
};
