import React from 'react';
import ProductSalesTable from './components/ProductSalesTable';
import DailySalesChart from './components/DailySalesChart';

const Dashboard = () => {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-6">Sales Dashboard</h1>
        <div className="my-4">
          <h2 className="text-xl mb-2">Sales by Product</h2>
          <ProductSalesTable />
        </div>
        <div className="my-8">
          <h2 className="text-xl mb-2">Sales by Day</h2>
          {/* <DailySalesChart /> */}
        </div>
      </div>
    );
  };
  

export default Dashboard;
   
