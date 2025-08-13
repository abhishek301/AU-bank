import * as fs from 'fs';
import * as path from 'path';
import { Sale, DateRange, FilteredSalesQuery } from '../types/Sale';

class DataService {
  private salesData: Sale[] = [];
  private statesCache: string[] = [];
  private dateRangeByStateCache: Map<string, DateRange> = new Map();
  private lastModified: number = 0;
  private readonly filePath: string;

  constructor(jsonFilePath: string = 'data/sales.json') {
    this.filePath = path.resolve(jsonFilePath);
    this.loadData();
    
    // Watch file for changes in development
    if (process.env.NODE_ENV !== 'production') {
      this.watchFile();
    }
  }

  private loadData(): void {
    try {
      const stats = fs.statSync(this.filePath);
      
      // Only reload if file has been modified
      if (stats.mtimeMs <= this.lastModified) {
        return;
      }

      console.log('Loading sales data...');
      const rawData = fs.readFileSync(this.filePath, 'utf-8');
      this.salesData = JSON.parse(rawData);
      this.lastModified = stats.mtimeMs;
      
      // Clear caches when data is reloaded
      this.clearCaches();
      
      // Pre-compute expensive operations
      this.precomputeStates();
      this.precomputeDateRanges();
      
      console.log(`Loaded ${this.salesData.length} sales records`);
    } catch (error) {
      console.error('Error loading sales data:', error);
      throw new Error('Failed to load sales data');
    }
  }

  private watchFile(): void {
    fs.watchFile(this.filePath, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log('Sales data file changed, reloading...');
        this.loadData();
      }
    });
  }

  private clearCaches(): void {
    this.statesCache = [];
    this.dateRangeByStateCache.clear();
  }

  private precomputeStates(): void {
    const statesSet = new Set<string>();
    this.salesData.forEach(sale => {
      if (sale.State && sale.State.trim()) {
        statesSet.add(sale.State.trim());
      }
    });
    this.statesCache = Array.from(statesSet).sort();
  }

  private precomputeDateRanges(): void {
    const stateGroupedData = new Map<string, Date[]>();
    
    this.salesData.forEach(sale => {
      if (!sale.State || !sale["Order Date"]) return;
      
      const state = sale.State.trim();
      const date = new Date(sale["Order Date"]);
      
      if (isNaN(date.getTime())) return;
      
      if (!stateGroupedData.has(state)) {
        stateGroupedData.set(state, []);
      }
      stateGroupedData.get(state)!.push(date);
    });

    // Compute min/max dates for each state
    stateGroupedData.forEach((dates, state) => {
      if (dates.length > 0) {
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        this.dateRangeByStateCache.set(state, {
          minDate: sortedDates[0].toISOString().split('T')[0],
          maxDate: sortedDates[sortedDates.length - 1].toISOString().split('T')[0]
        });
      }
    });
  }

  public getStates(): string[] {
    this.loadData(); // Check if reload is needed
    return [...this.statesCache]; // Return copy to prevent mutation
  }

  public getDateRangeForState(state: string): DateRange | null {
    this.loadData(); // Check if reload is needed
    return this.dateRangeByStateCache.get(state.trim()) || null;
  }

  public getFilteredSales(filters: FilteredSalesQuery): {
    data: Sale[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    this.loadData(); // Check if reload is needed
    
    let filteredData = [...this.salesData];

    // Apply state filter
    if (filters.state) {
      const stateFilter = filters.state.trim().toLowerCase();
      filteredData = filteredData.filter(sale => 
        sale.State && sale.State.trim().toLowerCase() === stateFilter
      );
    }

    // Apply city filter
    if (filters.city) {
      const cityFilter = filters.city.trim().toLowerCase();
      filteredData = filteredData.filter(sale => 
        sale.City && sale.City.trim().toLowerCase().includes(cityFilter)
      );
    }

    // Apply date range filter
    if (filters.startDate || filters.endDate) {
      filteredData = filteredData.filter(sale => {
        if (!sale["Order Date"]) return false;
        
        const saleDate = new Date(sale["Order Date"]);
        if (isNaN(saleDate.getTime())) return false;

        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (saleDate < startDate) return false;
        }

        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (saleDate > endDate) return false;
        }

        return true;
      });
    }

    // Pagination
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10)); // Max 100 items per page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / limit);

    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      totalPages
    };
  }

public getSalesStats(filters?: { state?: string; startDate?: string; endDate?: string }): {
    totalRecords: number;
    totalStates: number;
    dateRange: DateRange | null;
    totalSales: number;
    quantitySold: number;
    discountPercentage: number;
    totalProfit: number;
  } {
    this.loadData();
    
    let filteredData = [...this.salesData];

    // Apply filters if provided
    if (filters?.state) {
      const stateFilter = filters.state.trim().toLowerCase();
      filteredData = filteredData.filter(sale => 
        sale.State && sale.State.trim().toLowerCase() === stateFilter
      );
    }

    // Apply date range filter
    if (filters?.startDate || filters?.endDate) {
      filteredData = filteredData.filter(sale => {
        if (!sale["Order Date"]) return false;
        
        const saleDate = new Date(sale["Order Date"]);
        if (isNaN(saleDate.getTime())) return false;

        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (saleDate < startDate) return false;
        }

        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (saleDate > endDate) return false;
        }

        return true;
      });
    }
    
    if (filteredData.length === 0) {
      return {
        totalRecords: 0,
        totalStates: 0,
        dateRange: null,
        totalSales: 0,
        quantitySold: 0,
        discountPercentage: 0,
        totalProfit: 0
      };
    }

    // Calculate metrics from filtered data
    const totalSales = filteredData.reduce((sum, sale) => sum + (sale.Sales || 0), 0);
    const quantitySold = filteredData.reduce((sum, sale) => sum + (sale.Quantity || 0), 0);
    const totalProfit = filteredData.reduce((sum, sale) => sum + (sale.Profit || 0), 0);
    
    // Calculate weighted average discount percentage
    const totalSalesValue = filteredData.reduce((sum, sale) => sum + (sale.Sales || 0), 0);
    const totalDiscountedAmount = filteredData.reduce((sum, sale) => {
      const salesAmount = sale.Sales || 0;
      const discountRate = sale.Discount || 0;
      return sum + (salesAmount * discountRate);
    }, 0);
    const averageDiscountPercentage = totalSalesValue > 0 ? (totalDiscountedAmount / totalSalesValue) * 100 : 0;

    // Get date range for filtered data
    const dates = filteredData
      .map(sale => sale["Order Date"])
      .filter(date => date)
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const dateRange = dates.length > 0 ? {
      minDate: dates[0].toISOString().split('T')[0],
      maxDate: dates[dates.length - 1].toISOString().split('T')[0]
    } : null;

    // Get unique states from filtered data
    const uniqueStates = new Set(
      filteredData
        .map(sale => sale.State)
        .filter(state => state && state.trim())
        .map(state => state.trim())
    );

    return {
      totalRecords: filteredData.length,
      totalStates: uniqueStates.size,
      dateRange,
      totalSales: Math.round(totalSales * 100) / 100, // Round to 2 decimal places
      quantitySold,
      discountPercentage: Math.round(averageDiscountPercentage * 100) / 100, // Round to 2 decimal places
      totalProfit: Math.round(totalProfit * 100) / 100 // Round to 2 decimal places
    };
  }

  public getSalesByCity(filters?: { state?: string; startDate?: string; endDate?: string }) {
    this.loadData();

    let filteredData = [...this.salesData];

    // Apply state filter
    if (filters?.state) {
      const stateFilter = filters.state.trim().toLowerCase();
      filteredData = filteredData.filter(
        sale => sale.State && sale.State.trim().toLowerCase() === stateFilter
      );
    }

    // Apply date range filter
    if (filters?.startDate || filters?.endDate) {
      filteredData = filteredData.filter(sale => {
        if (!sale["Order Date"]) return false;
        const saleDate = new Date(sale["Order Date"]);
        if (isNaN(saleDate.getTime())) return false;

        if (filters.startDate && saleDate < new Date(filters.startDate)) return false;
        if (filters.endDate && saleDate > new Date(filters.endDate)) return false;

        return true;
      });
    }

    // Group sales by city
    const salesByCityMap = filteredData.reduce((acc, sale) => {
      if (!sale.City) return acc;
      acc[sale.City] = (acc[sale.City] || 0) + (sale.Sales || 0);
      return acc;
    }, {} as Record<string, number>);

    const maxSales = Math.max(...Object.values(salesByCityMap), 0);

    // Format for API
    return Object.entries(salesByCityMap).map(([city, sales]) => ({
      label: city,
      value: maxSales ? Math.round((sales / maxSales) * 100) : 0,
      total: 100
    }));
  }
}

export default DataService;
