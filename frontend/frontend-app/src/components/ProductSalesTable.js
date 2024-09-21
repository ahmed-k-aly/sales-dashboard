import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { fetchProductSales } from '../api';

const ProductSalesTable = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch sales data from the backend API
    const getSalesData = async () => {
      const data = await fetchProductSales();
      console.log("Data is :", data);
      alert(data);
      setSalesData(data);
    };
    getSalesData();
  }, []);

  // Render table rows
  const rows = salesData.map((sale, index) => (
    <tr key={index}>
      <td>{sale.product}</td>
      <td>{sale.total_sales}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Total Sales</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProductSalesTable;
