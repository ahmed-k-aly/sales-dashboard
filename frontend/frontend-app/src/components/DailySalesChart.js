import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchDailySales } from '../api';
import { Card } from '@mantine/core';

const DailySalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const getSalesData = async () => {
      const data = await fetchDailySales();
      setSalesData(data);
    };
    getSalesData();
  }, []);

  // Prepare data for the chart
  const labels = salesData.map(sale => sale.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map(sale => sale.total_sales),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Card shadow="sm" padding="lg">
      <Line data={data} />
    </Card>
  );
};

export default DailySalesChart;
