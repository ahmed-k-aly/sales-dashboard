import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Update this with your actual backend URL

// Fetch sales per product
export const fetchProductSales = async () => {
  const response = await axios.get(`${API_URL}/sales/product`);
  return response.data;
};

// Fetch sales per day
export const fetchDailySales = async () => {
  const response = await axios.get(`${API_URL}/sales/day`);
  return response.data;
};
