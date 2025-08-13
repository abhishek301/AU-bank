import { apiClient, retryRequest } from './axiosConfig';
import type {
    ApiResponse,
    DateRange,
    PaginatedSalesResponse,
    SalesStats,
    SalesFilters,
    SalesByCityItem
} from '../types/api';

class SalesApiService {
  
  // Get all states for dropdown
  async getStates(): Promise<string[]> {
    const response = await retryRequest(() => 
      apiClient.get<ApiResponse<string[]> & { count: number }>('/sales/states')
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch states');
  }

  // Get date range for a specific state
  async getDateRangeForState(state: string): Promise<DateRange> {
    if (!state.trim()) {
      throw new Error('State is required');
    }
    
    const response = await retryRequest(() =>
      apiClient.get<ApiResponse<DateRange>>(`/sales/date-range/${encodeURIComponent(state)}`)
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch date range');
  }

  // Get filtered sales data with pagination
  async getSalesData(filters: SalesFilters = {}): Promise<PaginatedSalesResponse> {
    // Clean up undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const response = await retryRequest(() =>
      apiClient.get<ApiResponse<never> & PaginatedSalesResponse>('/sales/data', {
        params: cleanFilters
      })
    );
    
    if (response.data.success) {
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    }
    throw new Error(response.data.error || 'Failed to fetch sales data');
  }


  // Get statistics with optional filters
  async getStats(filters?: { state?: string; startDate?: string; endDate?: string }): Promise<SalesStats> {
    // Clean up undefined values
    const cleanFilters = filters ? Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    ) : {};
    
    const response = await retryRequest(() =>
      apiClient.get<ApiResponse<SalesStats> & { filters?: any }>('/sales/stats', {
        params: cleanFilters
      })
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch statistics');
  }

async getSalesByCity(filters?: { state?: string; startDate?: string; endDate?: string }): Promise<SalesByCityItem[]> {
    // Remove empty/undefined params
    const cleanFilters = filters
      ? Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      : {};

    const response = await retryRequest(() =>
      apiClient.get<ApiResponse<SalesByCityItem[]>>('/sales/sales-by-city', {
        params: cleanFilters
      })
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch sales by city');
  }
}

// Export singleton instance
export const salesApi = new SalesApiService();
