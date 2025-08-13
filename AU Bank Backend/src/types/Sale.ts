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
  minDate: string;
  maxDate: string;
}

export interface FilteredSalesQuery {
  state?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  page?: number;
  limit?: number;
}