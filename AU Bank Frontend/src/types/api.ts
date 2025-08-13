export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Sale {
  "Row ID": number;
  "Order ID": string;
  "Order Date": string;
  "Ship Date": string;
  "Ship Mode": string;
  "Customer ID": string;
  "Customer Name": string;
  "Segment": string;
  "Country": string;
  "City": string;
  "State": string;
  "Postal Code": number;
  "Region": string;
  "Product ID": string;
  "Category": string;
  "Sub-Category": string;
  "Product Name": string;
  "Sales": number;
  "Quantity": number;
  "Discount": number;
  "Profit": number;
}

export interface DateRange {
  state: string;
  minDate: string;
  maxDate: string;
}

export interface PaginatedSalesResponse {
  data: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesStats {
  totalRecords: number;
  totalStates: number;
  dateRange: {
    minDate: string;
    maxDate: string;
  } | null;
  totalSales: number;
  quantitySold: number;
  discountPercentage: number;
  totalProfit: number;
}

export interface SalesFilters {
  state?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SalesByCityItem {
  label: string;
  value: number;
  total: number;
}