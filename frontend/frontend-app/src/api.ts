import axios from 'axios';

// Define the base URL for your FastAPI backend
const API_URL = 'http://localhost:8000';

// Define the data types for responses
export interface Sale {
  transaction_id: number;
  product: string;
  total_sales: number;
  category: string;
  quantity: number | null; // Allow null for quantity in case of missing values
  price: number | null;    // Allow null for price in case of missing values
  date: string;
}

export interface DaySale {
  date: string;
  total_sales: number;
}

export interface Product {
  product: string;
  category?: string;
  quantity?: number;
  total_sales: number;
}

// Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch sales per product (individual transactions)
export const fetchProductSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get<Sale[]>('/sales/product');
    return response.data;
  } catch (error) {
    console.error('Error fetching product sales:', error);
    throw error;
  }
};

// Fetch total sales per product
export const fetchTotalSalesPerProduct = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/sales/total_per_product');
    return response.data;
  } catch (error) {
    console.error('Error fetching total sales per product:', error);
    throw error;
  }
};

// Fetch sales per day with optional date filters
export const fetchDailySales = async (
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<DaySale[]> => {
  try {
    const params: Record<string, string | undefined> = {};

    if (date) {
      params.date = date;
    }
    if (startDate) {
      params.start_date = startDate;
    }
    if (endDate) {
      params.end_date = endDate;
    }

    const response = await api.get<DaySale[]>('/sales/day', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    throw error;
  }
};
